import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Event from "../models/event.model.js";

/**
 * Resolve a productId against both Product and Event collections.
 * Returns { product, itemModel } or { product: null, itemModel: null }.
 */
const resolveItem = async (productId) => {
    let product = await Product.findById(productId);
    if (product) return { product, itemModel: "Product" };
    product = await Event.findById(productId);
    if (product) return { product, itemModel: "Event" };
    return { product: null, itemModel: null };
};

/**
 * Populate cart items dynamically – works for both Product and Event refs.
 * Mongoose refPath requires itemModel to be set on each sub-doc.
 * For backward-compat items that lack itemModel (legacy "Product" ref), we
 * ensure itemModel defaults to "Product" before populating.
 */
const populateCart = async (cart) => {
    // Ensure every item has itemModel set (backward compat for legacy items)
    let needsSave = false;
    cart.items.forEach((item) => {
        if (!item.itemModel) {
            item.itemModel = "Product";
            needsSave = true;
        }
    });
    if (needsSave) await cart.save();

    return cart.populate({
        path: "items.productId",
        populate: { path: "shop", select: "name avatar" },
    });
};

// 1. Get User Cart
const getCart = catchAsyncErrors(async (req, res, next) => {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    await populateCart(cart);
    res.status(200).json({ success: true, cart });
});

// 2. Add to Cart  (supports both Product and Event items)
const addToCart = catchAsyncErrors(async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const { product, itemModel } = await resolveItem(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (quantity > product.stock) {
        return next(new ErrorHandler(`Only ${product.stock} items left in stock`, 400));
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
        // Item exists – update quantity
        let newQty = cart.items[itemIndex].quantity + quantity;
        if (newQty > product.stock) {
            return next(new ErrorHandler(`Cannot add more. Only ${product.stock} items available`, 400));
        }
        cart.items[itemIndex].quantity = newQty;
        // Ensure itemModel is correct (fix legacy items on the fly)
        cart.items[itemIndex].itemModel = itemModel;
    } else {
        // New item
        cart.items.push({ productId, quantity, itemModel });
    }

    await cart.save();
    await populateCart(cart);

    res.status(200).json({ success: true, cart, message: "Added to cart" });
});

// 3. Update Cart Item Quantity  (supports both Product and Event items)
const updateCartItem = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) return next(new ErrorHandler("Quantity must be at least 1", 400));

    const { product } = await resolveItem(productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (quantity > product.stock) {
        return next(new ErrorHandler(`Only ${product.stock} items left in stock`, 400));
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return next(new ErrorHandler("Cart not found", 404));

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await populateCart(cart);
        res.status(200).json({ success: true, cart, message: "Cart updated" });
    } else {
        return next(new ErrorHandler("Item not found in cart", 404));
    }
});

// 4. Remove Item from Cart
const removeFromCart = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return next(new ErrorHandler("Cart not found", 404));

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    await populateCart(cart);

    res.status(200).json({ success: true, cart, message: "Removed from cart" });
});

// 5. Clear Cart
const clearCart = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (cart) {
        cart.items = [];
        await cart.save();
    }

    res.status(200).json({ success: true, cart, message: "Cart cleared" });
});

// 6. Merge Guest Cart  (supports both Product and Event items)
const mergeCart = catchAsyncErrors(async (req, res, next) => {
    const { items } = req.body; // Array of { productId, quantity }
    const userId = req.user._id;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(200).json({ success: true, message: "No items to merge" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    for (let guestItem of items) {
        const { product, itemModel } = await resolveItem(guestItem.productId);
        if (product) {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === guestItem.productId);
            if (itemIndex > -1) {
                // Merge quantity safely respecting stock
                let newQty = cart.items[itemIndex].quantity + guestItem.quantity;
                cart.items[itemIndex].quantity = Math.min(newQty, product.stock);
                cart.items[itemIndex].itemModel = itemModel;
            } else {
                // Add new item respecting stock
                let safeQty = Math.min(guestItem.quantity, product.stock);
                if (safeQty > 0) {
                    cart.items.push({ productId: guestItem.productId, quantity: safeQty, itemModel });
                }
            }
        }
    }

    await cart.save();
    await populateCart(cart);

    res.status(200).json({ success: true, cart, message: "Cart merged successfully" });
});

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart
};
