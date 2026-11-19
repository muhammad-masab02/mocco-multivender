import Shop from "../models/shop.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Event from "../models/event.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { createActivationToken } from "../utils/createToken.js";
import sendMail from "../utils/sendMail.js";
import sendToken, { clearAuthCookie } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// shop create 
const registerShop = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            phoneNumber,
            description,
            addresses: addressesFromBody,
            address,
            zipCode,
        } = req.body || {};

        const addresses = addressesFromBody || address;

        if (!name || !email || !password || !phoneNumber || !addresses || !zipCode) {
            return res
                .status(400)
                .json({ success: false, message: "Please enter all fields!" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // Check if shop already exists (case-insensitive)
        const existingShop = await Shop.findOne({
            email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
        });
        if (existingShop) {
            return next(new ErrorHandler("Shop already exists!", 400));
        }

        // Handle avatar upload via Cloudinary
        let avatar = {
            public_id: "shop-avatar",
            url: "https://dummyimage.com/200x200/e2e8f0/64748b.png&text=Shop",
        };

        if (req.file) {
            const cloudRes = await uploadToCloudinary(req.file, "mocco/shops");
            if (cloudRes) {
                avatar = cloudRes;
            }
        }

        // Create shop object
        const shop = {
            name,
            email: normalizedEmail,
            password,
            phoneNumber,
            description,
            addresses,
            zipCode,
            avatar,
        };

        // create activation token
        const activationToken = createActivationToken(shop);
        const activationUrl = `${process.env.FRONTEND_URL}/seller/activate/${activationToken}`;

        // Send activation email
        try {
            await sendMail({
                email: shop.email,
                subject: "Activate Your Mocco Shop Account",
                message: `Hello ${shop.name},\n\nPlease click the following link to activate your shop:\n\n${activationUrl}\n\nIf you did not create this account, please ignore this email.\n\nBest regards,\nMocco Team`,
            });
            // response to frontend
            res.status(201).json({
                success: true,
                message: `Registration successful! Please check your email:- ${shop.email} first, to activate your shop.`,
            });
        } catch (error) {
            console.error("Error sending activation email:", error);
            return next(
                new ErrorHandler(
                    "Failed to send activation email! " + error.message,
                    500,
                ),
            );
        }

        // Create new shop
    } catch (error) {
        console.error("Error in registerShop:", error);
        return next(
            new ErrorHandler(
                "Failed to create shop! " + error.message,
                500,
            ),
        );
    }
}

// activate shop account
const activateShopEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return next(new ErrorHandler("Activation token is required!", 400));
        }

        const activationSecret =
            process.env.ACTIVATION_TOKEN_SECRET_KEY || process.env.JWT_SECRET_KEY;

        const decodedToken = jwt.verify(token, activationSecret);
        const normalizedEmail = String(decodedToken.email).trim().toLowerCase();

        const existingShop = await Shop.findOne({
            email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
        });

        if (existingShop) {
            return next(new ErrorHandler("Shop already activated!", 400));
        }

        const createdShop = await Shop.create({
            name: decodedToken.name,
            email: normalizedEmail,
            password: decodedToken.password,
            avatar: decodedToken.avatar,
            phoneNumber: decodedToken.phoneNumber,
            description: decodedToken.description,
            addresses: decodedToken.addresses,
            zipCode: decodedToken.zipCode,
        });

        sendToken(createdShop, 201, res, "seller", req);
    } catch (error) {
        console.error("Error in activateShopEmail:", error);
        return next(
            new ErrorHandler(
                "Failed to activate shop account! " + error.message,
                500,
            ),
        );
    }
};

// login shop
const loginShop = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter all fields!", 400));
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        const shop = await Shop.findOne({
            email: { $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i") },
        }).select("+password");

        if (!shop) {
            return next(new ErrorHandler("Invalid email or password!", 401));
        }

        if (!shop.password) {
            return next(new ErrorHandler("Invalid email or password!", 401));
        }

        const isPasswordMatched = await shop.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password!", 401));
        }

        sendToken(shop, 200, res, "seller", req);

    } catch (error) {
        console.error("Error in loginShop:", error);
        return next(
            new ErrorHandler(
                "Failed to login shop! " + error.message,
                500,
            ),
        );
    }
}


// get seller profile/data
const getSeller = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.seller._id);

        // error 
        if (!shop) {
            return next(new ErrorHandler("Shop not found!", 404));
        }

        res.status(200).json({
            success: true,
            shop,
        });
    } catch (error) {
        console.error("Error in getSeller:", error);
        return next(
            new ErrorHandler(
                "Failed to fetch seller profile! " + error.message,
                500,
            ),
        );
    }
};

// get public shop info with aggregated reviews from products & events
const getShopInfo = async (req, res, next) => {
    try {
        const { shopId } = req.params;
        const shop = await Shop.findById(shopId).select("-password -phoneNumber");

        if (!shop) {
            return next(new ErrorHandler("Shop not found!", 404));
        }

        // Fetch all products and events for this shop with reviews populated
        const [products, events] = await Promise.all([
            Product.find({ shop: shopId }, "name images reviews")
                .populate("reviews.user", "name avatar"),
            Event.find({ shop: shopId }, "name images reviews")
                .populate("reviews.user", "name avatar"),
        ]);

        const allReviews = [];
        products.forEach((p) => {
            (p.reviews || []).forEach((r) => {
                allReviews.push({
                    _id: r._id,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt,
                    user: r.user,
                    itemType: "product",
                    itemId: p._id,
                    itemName: p.name,
                    itemImage: p.images?.[0]?.url || null,
                });
            });
        });

        events.forEach((e) => {
            (e.reviews || []).forEach((r) => {
                allReviews.push({
                    _id: r._id,
                    rating: r.rating,
                    comment: r.comment,
                    createdAt: r.createdAt,
                    user: r.user,
                    itemType: "event",
                    itemId: e._id,
                    itemName: e.name,
                    itemImage: e.images?.[0]?.url || null,
                });
            });
        });

        // Sort reviews by latest first
        allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            shop,
            reviews: allReviews,
        });
    } catch (error) {
        console.error("Error in getShopInfo:", error);
        return next(
            new ErrorHandler(
                "Failed to fetch shop info! " + error.message,
                500,
            ),
        );
    }
};

// log out shop 
const logoutShop = async (req, res, next) => {
    try {
        clearAuthCookie(res, "seller_token", req);

        res.status(200).json({
            success: true,
            message: "Seller logged out successfully!",
        });
    } catch (error) {
        console.error("Error in logoutShop:", error);
        return next(
            new ErrorHandler(
                "Failed to logout seller! " + error.message,
                500,
            ),
        );
    }
};

// update seller/shop info
const updateSellerInfo = async (req, res, next) => {
    try {
        const {
            name,
            description,
            shopAddress,
            addresses,
            address,
            phoneNumber,
            zipCode,
        } = req.body || {};

        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("Shop not found!", 404));
        }

        if (name) seller.name = name;
        if (description !== undefined) seller.description = description;

        const newAddress = shopAddress || addresses || address;
        if (newAddress) seller.addresses = newAddress;

        if (phoneNumber) seller.phoneNumber = phoneNumber;
        if (zipCode) seller.zipCode = Number(zipCode);

        // Check if an avatar file was uploaded via req.file or req.files
        const file = req.file || (req.files && req.files[0]);
        if (file) {
            if (seller.avatar?.public_id) {
                await deleteFromCloudinary(seller.avatar.public_id);
            }
            const cloudRes = await uploadToCloudinary(file, "mocco/shops");
            if (cloudRes) {
                seller.avatar = cloudRes;
            }
        }

        await seller.save();

        res.status(200).json({
            success: true,
            shop: seller,
            message: "Shop settings updated successfully!",
        });
    } catch (error) {
        console.error("Error in updateSellerInfo:", error);
        return next(
            new ErrorHandler(
                "Failed to update shop info! " + error.message,
                500,
            ),
        );
    }
};

// GET /api/v1/shop/dashboard-stats (seller auth)
// Returns all key dashboard metrics derived from real data
const getDashboardStats = async (req, res, next) => {
    try {
        const sellerId = req.seller._id;

        // ── 1. Products ────────────────────────────────────────────────────────
        const products = await Product.find({ shop: sellerId });
        const totalProducts = products.length;
        const totalSold = products.reduce((sum, p) => sum + (p.total_sell || 0), 0);

        // ── 2. Active Events ───────────────────────────────────────────────────
        const now = new Date();
        const activeEvents = await Event.countDocuments({
            shop: sellerId,
            status: "Running",
            startDate: { $lte: now },
            endDate: { $gte: now },
        });

        // ── 3. All shop orders (filter by seller's products) ──────────────────
        const allOrders = await Order.find()
            .populate({
                path: "items.productId",
                select: "shop",
            })
            .sort({ createdAt: -1 });

        const shopOrders = allOrders.filter(order =>
            order.items.some(item => {
                const itemShop = item.productId?.shop?.toString();
                return itemShop === sellerId.toString();
            })
        );

        const totalOrders = shopOrders.length;

        // ── 4. Revenue (Delivered orders, 10% platform fee deducted) ─────────
        const deliveredOrders = shopOrders.filter(o => o.status === "Delivered");
        const grossRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalRevenue = grossRevenue * 0.9; // After 10% platform fee

        // ── 5. Pending Orders (not delivered, not cancelled) ──────────────────
        const terminalStatuses = new Set(["Delivered", "Cancelled", "Refund Success", "Returned"]);
        const pendingOrders = shopOrders.filter(o => !terminalStatuses.has(o.status)).length;

        // ── 6. Average Order Value ─────────────────────────────────────────────
        const averageOrderValue = totalOrders > 0
            ? shopOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) / totalOrders
            : 0;

        // ── 7. Recent Orders (last 10, enriched for UI) ────────────────────────
        const recentOrders = shopOrders.slice(0, 10).map(o => ({
            _id: o._id,
            status: o.status,
            totalAmount: o.totalAmount,
            createdAt: o.createdAt,
            itemCount: o.items.length,
            paymentMethod: o.paymentInfo?.method,
        }));

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalOrders,
                totalRevenue,
                grossRevenue,
                activeEvents,
                pendingOrders,
                averageOrderValue,
                totalSold,
                deliveredOrdersCount: deliveredOrders.length,
                recentOrders,
                // NOTE: availableBalance and withdrawalRequests are not yet
                // implemented in the backend data model. They require a
                // Withdrawal model and balance tracking logic.
                availableBalance: null,
                withdrawalRequests: null,
            },
        });
    } catch (error) {
        console.error("Error in getDashboardStats:", error);
        return next(
            new ErrorHandler("Failed to fetch dashboard stats! " + error.message, 500)
        );
    }
};

// get all public sellers list with aggregated stats
const getAllSellersPublic = async (req, res, next) => {
    try {
        const { search, sort } = req.query;

        let query = {};
        if (search && String(search).trim()) {
            const regex = new RegExp(escapeRegex(search.trim()), "i");
            query = {
                $or: [
                    { name: regex },
                    { description: regex },
                    { addresses: regex },
                ],
            };
        }

        // Fetch all shops excluding sensitive auth/balance fields
        const shops = await Shop.find(query)
            .select("-password -availableBalance -resetPasswordToken -resetPasswordTime")
            .sort({ createdAt: -1 })
            .lean();

        if (!shops || shops.length === 0) {
            return res.status(200).json({
                success: true,
                sellers: [],
                totalSellers: 0,
            });
        }

        const shopIds = shops.map((s) => s._id);

        // Aggregate product stats (count, total sold, average rating) per shop
        const [productStats, eventStats] = await Promise.all([
            Product.aggregate([
                { $match: { shop: { $in: shopIds } } },
                {
                    $group: {
                        _id: "$shop",
                        productCount: { $sum: 1 },
                        totalSell: { $sum: { $ifNull: ["$total_sell", 0] } },
                        avgProductRating: { $avg: { $ifNull: ["$rating", 0] } },
                    },
                },
            ]),
            Event.aggregate([
                { $match: { shop: { $in: shopIds } } },
                {
                    $group: {
                        _id: "$shop",
                        eventCount: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const productMap = new Map();
        productStats.forEach((stat) => {
            productMap.set(String(stat._id), stat);
        });

        const eventMap = new Map();
        eventStats.forEach((stat) => {
            eventMap.set(String(stat._id), stat);
        });

        // Enrich sellers with aggregated metadata
        let enrichedSellers = shops.map((shop) => {
            const pStat = productMap.get(String(shop._id)) || {
                productCount: 0,
                totalSell: 0,
                avgProductRating: 0,
            };
            const eStat = eventMap.get(String(shop._id)) || {
                eventCount: 0,
            };

            const computedRating = shop.ratings || pStat.avgProductRating || 0;

            return {
                ...shop,
                productCount: pStat.productCount,
                totalSell: pStat.totalSell,
                eventCount: eStat.eventCount,
                ratings: Number(computedRating) ? Number(computedRating).toFixed(1) : "0.0",
            };
        });

        // Optional server-side sorting if requested
        if (sort === "products-desc") {
            enrichedSellers.sort((a, b) => b.productCount - a.productCount);
        } else if (sort === "rating-desc") {
            enrichedSellers.sort((a, b) => Number(b.ratings) - Number(a.ratings));
        } else if (sort === "sales-desc") {
            enrichedSellers.sort((a, b) => b.totalSell - a.totalSell);
        } else if (sort === "name-asc") {
            enrichedSellers.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        } else if (sort === "oldest") {
            enrichedSellers.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        res.status(200).json({
            success: true,
            sellers: enrichedSellers,
            totalSellers: enrichedSellers.length,
        });
    } catch (error) {
        console.error("Error in getAllSellersPublic:", error);
        return next(
            new ErrorHandler("Failed to fetch sellers list! " + error.message, 500)
        );
    }
};

export {
    registerShop,
    activateShopEmail,
    loginShop,
    getSeller,
    getShopInfo,
    logoutShop,
    updateSellerInfo,
    getDashboardStats,
    getAllSellersPublic,
};