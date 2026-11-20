import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Refund from "../models/refund.model.js";
import Product from "../models/product.model.js";
import Event from "../models/event.model.js";

// ─── Valid status transitions (seller can only move forward, or cancel/return/refund) ───
const VALID_TRANSITIONS = {
    "Processing": ["Ready for Pickup", "Shipped", "Cancelled"],
    "Ready for Pickup": ["Shipped", "Out for Delivery", "Cancelled"],
    "Shipped": ["Out for Delivery", "Delivered", "Cancelled"],
    "Out for Delivery": ["Delivered", "Cancelled"],
    "Delivered": ["Returned", "Processing Refund"],
    "Processing Refund": ["Refund Success", "Delivered"],
    "Refund Success": [],
    "Pending Payment": ["Processing", "Cancelled"],
    "Cancelled": [],
    "Returned": [],
};

/**
 * Helper to populate order items from both Product and Event collections.
 * Automatically backfills itemModel on legacy items and sets order.shop if missing.
 */
const populateOrderItems = async (orders) => {
    const isArray = Array.isArray(orders);
    const orderList = isArray ? orders : (orders ? [orders] : []);
    if (!orderList.length) return orders;

    // Collect all unique productIds across all orders
    const allIds = [];
    for (const order of orderList) {
        if (!order?.items) continue;
        for (const item of order.items) {
            const rawId = (item.productId?._id || item.productId)?.toString();
            if (rawId) allIds.push(rawId);
        }
    }

    if (!allIds.length) return orders;

    // Check which ones are Event products vs Products
    const [eventMatches, productMatches] = await Promise.all([
        Event.find({ _id: { $in: allIds } }).select("_id shop"),
        Product.find({ _id: { $in: allIds } }).select("_id shop"),
    ]);

    const eventIdSet = new Set(eventMatches.map(e => e._id.toString()));
    const eventShopMap = new Map(eventMatches.map(e => [e._id.toString(), e.shop]));
    const productShopMap = new Map(productMatches.map(p => [p._id.toString(), p.shop]));

    // Ensure itemModel and order.shop are correctly set for both collections
    for (const order of orderList) {
        if (!order?.items) continue;
        let needsSave = false;
        order.items.forEach((item) => {
            const rawId = (item.productId?._id || item.productId)?.toString();
            if (rawId && eventIdSet.has(rawId)) {
                if (item.itemModel !== "Event") {
                    item.itemModel = "Event";
                    needsSave = true;
                }
                if (!order.shop && eventShopMap.has(rawId)) {
                    order.shop = eventShopMap.get(rawId);
                    needsSave = true;
                }
            } else if (rawId && productShopMap.has(rawId)) {
                if (!item.itemModel) {
                    item.itemModel = "Product";
                    needsSave = true;
                }
                if (!order.shop && productShopMap.has(rawId)) {
                    order.shop = productShopMap.get(rawId);
                    needsSave = true;
                }
            }
        });

        if (needsSave && typeof order.save === "function") {
            try {
                await order.save();
            } catch (err) {
                // Ignore transient write errors during populate
            }
        }
    }

    // Populate items.productId dynamically using refPath: "items.itemModel"
    await Order.populate(orderList, [
        { path: "user", select: "name email avatar" },
        {
            path: "items.productId",
            select: "name images price discount_price shop category stock total_sell startDate endDate status",
            populate: { path: "shop", select: "name email avatar" }
        }
    ]);

    return isArray ? orderList : orderList[0];
};


// ────────────────────────────────────────────────────────────────────────────────
// POST /api/v1/order/create-order (user auth)
// ────────────────────────────────────────────────────────────────────────────────
const createOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentInfo, totalAmount } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return next(new ErrorHandler("No order items provided.", 400));
        }
        if (!shippingAddress) {
            return next(new ErrorHandler("Shipping address is required.", 400));
        }
        if (!paymentInfo?.method) {
            return next(new ErrorHandler("Payment information is required.", 400));
        }

        // Ensure every item has sellerId and itemModel resolved
        for (const item of orderItems) {
            const targetId = item.productId || item._id;
            if (!item.sellerId || !item.itemModel) {
                const prod = await Product.findById(targetId);
                if (prod) {
                    item.sellerId = item.sellerId || prod.shop?.toString();
                    item.itemModel = item.itemModel || "Product";
                } else {
                    const ev = await Event.findById(targetId);
                    if (ev) {
                        item.sellerId = item.sellerId || ev.shop?.toString();
                        item.itemModel = item.itemModel || "Event";
                    }
                }
            }
        }

        // Group items by seller for multi-vendor order splitting
        const groupedItems = orderItems.reduce((acc, item) => {
            const sellerId = item?.sellerId?.toString();
            if (!sellerId) return acc;
            if (!acc[sellerId]) acc[sellerId] = [];
            acc[sellerId].push(item);
            return acc;
        }, {});

        const userId = req.user._id;

        const orders = await Promise.all(
            Object.entries(groupedItems).map(async ([sellerId, items]) => {
                const sellerTotal = items.reduce(
                    (sum, item) => sum + (item.price || 0) * item.quantity,
                    0
                );

                const order = await Order.create({
                    user: userId,
                    shop: sellerId,
                    items,
                    shippingAddress,
                    paymentInfo: {
                        transactionId: paymentInfo.transactionId || null,
                        method: paymentInfo.method,
                        paymentStatus: paymentInfo.paymentStatus || "Unpaid",
                    },
                    totalAmount: sellerTotal,
                    paidAt: paymentInfo.paymentStatus === "Paid" ? Date.now() : undefined,
                });

                return order;
            })
        );

        // ─── Reserve stock immediately on order placement (prevent overselling) ──
        const stockReserves = orderItems.map(async (item) => {
            const qty = Number(item.quantity) || 1;
            const targetId = item.productId || item._id;
            const updatedProduct = await Product.findByIdAndUpdate(
                targetId,
                { $inc: { stock: -qty } },
                { new: false }
            );
            if (!updatedProduct) {
                await Event.findByIdAndUpdate(
                    targetId,
                    { $inc: { stock: -qty } },
                    { new: false }
                );
            }
        });
        await Promise.allSettled(stockReserves);

        // Clear the user's cart after successful order creation
        await Cart.findOneAndUpdate({ userId }, { items: [] });

        res.status(201).json({
            success: true,
            orders,
            message: `${orders.length} order(s) created successfully.`,
        });
    } catch (error) {
        console.error("Error in createOrder:", error);
        return next(new ErrorHandler("Failed to create order! " + error.message, 500));
    }
});


// ────────────────────────────────────────────────────────────────────────────────
// GET /api/v1/order/my-orders (user auth)
// Returns all orders belonging to the logged-in user, most recent first
// ────────────────────────────────────────────────────────────────────────────────
const getMyOrders = catchAsyncErrors(async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        await populateOrderItems(orders);

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        return next(new ErrorHandler("Failed to fetch orders! " + error.message, 500));
    }
});


// ────────────────────────────────────────────────────────────────────────────────
// GET /api/v1/order/shop-orders (seller auth)
// Returns all orders that contain at least one product/event belonging to the logged-in shop
// ────────────────────────────────────────────────────────────────────────────────
const getShopOrders = catchAsyncErrors(async (req, res, next) => {
    try {
        const sellerId = req.seller._id.toString();

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        await populateOrderItems(orders);

        // Filter to only orders that have at least one item belonging to this seller's shop
        const shopOrders = orders.filter(order => {
            const orderShopId = order.shop?._id?.toString() || order.shop?.toString();
            if (orderShopId && orderShopId === sellerId) return true;

            return order.items && order.items.some(item => {
                const itemShop =
                    item.productId?.shop?._id?.toString() ||
                    item.productId?.shop?.toString() ||
                    item.sellerId?.toString();
                return itemShop === sellerId;
            });
        });

        res.status(200).json({
            success: true,
            orders: shopOrders,
        });
    } catch (error) {
        console.error("Error in getShopOrders:", error);
        return next(new ErrorHandler("Failed to fetch shop orders! " + error.message, 500));
    }
});


// ────────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/order/:id/status (seller auth)
// Updates status with transition validation and sets deliveredAt when delivered
// ────────────────────────────────────────────────────────────────────────────────
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        if (!status) {
            return next(new ErrorHandler("Status is required.", 400));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new ErrorHandler("Order not found.", 404));
        }

        const currentStatus = order.status;

        // Validate transition
        const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
        if (!allowedNext.includes(status)) {
            return next(
                new ErrorHandler(
                    `Cannot transition order from "${currentStatus}" to "${status}". Allowed: ${allowedNext.join(", ") || "none"}.`,
                    400
                )
            );
        }

        // Optionally set deliveredAt timestamp
        if (status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        // ─── Side-effects based on new status ───────────────────────────────────
        order.status = status;
        await order.save();

        if (status === "Delivered") {
            // Confirm real sales: increment total_sell for every item in the order.
            // Stock was already decremented when the order was placed.
            const sellUpdates = order.items.map(async (item) => {
                const qty = Number(item.quantity) || 1;
                const targetId = item.productId?._id || item.productId;
                const updatedProduct = await Product.findByIdAndUpdate(
                    targetId,
                    { $inc: { total_sell: qty } },
                    { new: false }
                );
                if (!updatedProduct) {
                    await Event.findByIdAndUpdate(
                        targetId,
                        { $inc: { total_sell: qty } },
                        { new: false }
                    );
                }
            });
            await Promise.allSettled(sellUpdates);
        }

        if (status === "Cancelled") {
            // Order cancelled before delivery: return the reserved stock.
            // total_sell was never incremented, so nothing to reverse there.
            const stockRestores = order.items.map(async (item) => {
                const qty = Number(item.quantity) || 1;
                const targetId = item.productId?._id || item.productId;
                const updatedProduct = await Product.findByIdAndUpdate(
                    targetId,
                    { $inc: { stock: qty } },
                    { new: false }
                );
                if (!updatedProduct) {
                    await Event.findByIdAndUpdate(
                        targetId,
                        { $inc: { stock: qty } },
                        { new: false }
                    );
                }
            });
            await Promise.allSettled(stockRestores);
        }
        // ─────────────────────────────────────────────────────────────────────────

        await populateOrderItems(order);

        res.status(200).json({
            success: true,
            order,
            message: `Order status updated to "${status}".`,
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return next(new ErrorHandler("Failed to update order status! " + error.message, 500));
    }
});


// ────────────────────────────────────────────────────────────────────────────────
// POST /api/v1/order/refund (user auth)
// Submits a refund request for a delivered order and sets status to "Processing Refund"
// ────────────────────────────────────────────────────────────────────────────────
const requestRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const { orderId, reason } = req.body;

        if (!orderId || !reason?.trim()) {
            return next(new ErrorHandler("Order ID and refund reason are required.", 400));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new ErrorHandler("Order not found.", 404));
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("Unauthorized request for this order.", 403));
        }

        if (order.status !== "Delivered") {
            return next(
                new ErrorHandler(
                    `Refund can only be requested for orders with status "Delivered". Current status: "${order.status}".`,
                    400
                )
            );
        }

        const existingRefund = await Refund.findOne({ order: orderId });
        if (existingRefund) {
            return next(new ErrorHandler("A refund request has already been submitted for this order.", 400));
        }

        await populateOrderItems(order);
        const shopId = order.shop?._id || order.shop || order.items?.[0]?.productId?.shop?._id || order.items?.[0]?.productId?.shop || null;

        const refund = await Refund.create({
            order: orderId,
            user: req.user._id,
            shop: shopId,
            reason: reason.trim(),
            totalAmount: order.totalAmount,
            status: "Processing",
        });

        // Update order status to "Processing Refund"
        order.status = "Processing Refund";
        await order.save();

        res.status(201).json({
            success: true,
            message: "Refund request submitted successfully!",
            refund,
            order,
        });
    } catch (error) {
        console.error("Error in requestRefund:", error);
        return next(new ErrorHandler("Failed to request refund! " + error.message, 500));
    }
});


// ────────────────────────────────────────────────────────────────────────────────
// GET /api/v1/order/my-refunds (user auth)
// Returns all refund requests for the logged-in user
// ────────────────────────────────────────────────────────────────────────────────
const getMyRefunds = catchAsyncErrors(async (req, res, next) => {
    try {
        const refunds = await Refund.find({ user: req.user._id })
            .populate("shop", "name email")
            .populate("order")
            .sort({ createdAt: -1 });

        const refundOrders = refunds.map(r => r.order).filter(Boolean);
        await populateOrderItems(refundOrders);

        res.status(200).json({
            success: true,
            refunds,
        });
    } catch (error) {
        console.error("Error in getMyRefunds:", error);
        return next(new ErrorHandler("Failed to fetch refund requests! " + error.message, 500));
    }
});


export { createOrder, getMyOrders, getShopOrders, updateOrderStatus, requestRefund, getMyRefunds };
