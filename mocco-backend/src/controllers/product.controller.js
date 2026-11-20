import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Product from "../models/product.model.js";
import Event from "../models/event.model.js";
import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// get all products across shops (for storefront/home pages)
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({})
            .populate("shop", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        return next(
            new ErrorHandler("Failed to get products! " + error.message, 500),
        );
    }
});

// get only featured products (isFeatured === true)
const getFeaturedProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .populate("shop", "name avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getFeaturedProducts:", error);
        return next(
            new ErrorHandler("Failed to get featured products! " + error.message, 500),
        );
    }
});

// get best-selling products:
// criteria — sorted by total_sell desc + rating desc; minimum 1 sale
// fallback — if fewer than MIN_SOLD_FOR_SECTION products have sales, fill up
//            with top-rated/newest products so the home section is never empty
const MIN_SOLD_FOR_SECTION = 1; // minimum products with actual sales needed to skip fallback

const getBestSellingProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        // ── Step 1: products with actual sales ───────────────────────────────
        const soldProducts = await Product.find({ total_sell: { $gt: 0 } })
            .populate("shop", "name avatar")
            .sort({ total_sell: -1, rating: -1 })
            .limit(limit);

        // ── Step 2: if we have enough sold products, return them directly ────
        if (soldProducts.length >= MIN_SOLD_FOR_SECTION) {
            return res.status(200).json({
                success: true,
                products: soldProducts,
                source: "sold", // helpful for debugging
            });
        }

        // ── Step 3: fallback — fill remaining slots with top-rated/newest ───
        const soldIds = soldProducts.map((p) => p._id);
        const remaining = limit - soldProducts.length;

        const fallbackProducts = await Product.find({
            _id: { $nin: soldIds },   // exclude already-fetched sold products
            stock: { $gt: 0 },        // only in-stock products
        })
            .populate("shop", "name avatar")
            .sort({ rating: -1, total_sell: -1, createdAt: -1 })
            .limit(remaining);

        const products = [...soldProducts, ...fallbackProducts];

        return res.status(200).json({
            success: true,
            products,
            source: soldProducts.length === 0 ? "fallback" : "mixed",
        });
    } catch (error) {
        console.error("Error in getBestSellingProducts:", error);
        return next(
            new ErrorHandler("Failed to get best-selling products! " + error.message, 500),
        );
    }
});

// create product
const createProduct = catchAsyncErrors(async (req, res, next) => {
    try {

        const shop = req.seller; // get shop from authenticated seller

        const {
            name,
            description,
            category,
            mainCategory,
            subCategory,
            categoryPath,
            tags,
            stock,
            price,
            discount_price,
            total_sell,
            isFeatured,
        } = req.body;

        // Check if product already exists (same name in same shop)
        const existingProduct = await Product.findOne({
            name,
            shop: shop._id,
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in your shop",
            });
        }

        // Handle images via Cloudinary upload
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler("Please upload at least one image for the product.", 400));
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file, "mocco/products"));
        const images = await Promise.all(uploadPromises);

        let computedPath = categoryPath;
        if (!computedPath && category) {
            const parts = [mainCategory, subCategory, category].filter(Boolean);
            computedPath = parts.join(" > ");
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            category,
            mainCategory: mainCategory || "",
            subCategory: subCategory || "",
            categoryPath: computedPath || "",
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
            stock,
            price,
            discount_price,
            images,
            total_sell: Number(total_sell) || 0,
            isFeatured: isFeatured === "true" || isFeatured === true,
            shop: shop._id,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.error("Error in createProduct:", error);
        return next(
            new ErrorHandler("Failed to create product! " + error.message, 500),
        );
    }
});

// toggle isFeatured flag on a product (seller only)
const toggleFeatured = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller._id;

        const product = await Product.findById(id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Ensure the product belongs to the authenticated seller's shop
        if (product.shop.toString() !== sellerId.toString()) {
            // also try matching via shop document
            const shop = await Shop.findOne({ _id: product.shop });
            if (!shop || shop._id.toString() !== sellerId.toString()) {
                return next(new ErrorHandler("Not authorized to update this product", 403));
            }
        }

        product.isFeatured = !product.isFeatured;
        await product.save();

        return res.status(200).json({
            success: true,
            message: `Product ${product.isFeatured ? "marked as featured" : "removed from featured"}`,
            isFeatured: product.isFeatured,
            product,
        });
    } catch (error) {
        console.error("Error in toggleFeatured:", error);
        return next(
            new ErrorHandler("Failed to toggle featured status! " + error.message, 500),
        );
    }
});

// get all products of a shop
const getShopProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const sellerId = req.params.shopId;

        const shop = await Shop.findOne({ _id: sellerId });

        if (!shop) {
            return next(new ErrorHandler("Shop not found for this seller", 404));
        }

        const products = await Product.find({ shop: sellerId });

        return res.status(200).json({
            success: true,
            products,
        });

    } catch (error) {
        console.error("Error in getShopProducts:", error);
        return next(
            new ErrorHandler("Failed to get shop products! " + error.message, 500),
        );
    }
});

// get product by ID (searches Product, then Event, populates shop)
const getProductById = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;

        let product = await Product.findById(id)
            .populate("shop", "name avatar description createdAt")
            .populate("reviews.user", "name avatar");

        if (!product) {
            product = await Event.findById(id)
                .populate("shop", "name avatar description createdAt")
                .populate("reviews.user", "name avatar");
        }

        if (!product) {
            return next(new ErrorHandler("Product not found!", 404));
        }

        let relatedProducts = [];
        if (product.category) {
            // Find products in the same category, excluding the current one
            relatedProducts = await Product.find({
                category: product.category,
                _id: { $ne: product._id }
            })
                .sort({ total_sell: -1 }) // Sort by best selling
                .limit(4);
        }

        return res.status(200).json({
            success: true,
            product,
            relatedProducts,
        });
    } catch (error) {
        console.error("Error in getProductById:", error);
        return next(
            new ErrorHandler("Failed to get product details! " + error.message, 500),
        );
    }
});

// search products and events
const searchProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const { q } = req.query;
        let results = [];

        if (!q || q.trim() === "") {
            // Return top 10 products if query is empty
            const topProducts = await Product.find({})
                .populate("shop", "name avatar")
                .sort({ total_sell: -1, createdAt: -1 })
                .limit(10);

            results = topProducts.map(p => ({ ...p.toObject(), type: 'product' }));
        } else {
            // Search in both Products and Events
            const regex = new RegExp(q, 'i');

            const [products, events] = await Promise.all([
                Product.find({
                    $or: [
                        { name: regex },
                        { category: regex },
                        { subCategory: regex },
                        { mainCategory: regex },
                        { categoryPath: regex },
                        { tags: { $in: [regex] } }
                    ]
                }).populate("shop", "name avatar").limit(10),
                Event.find({
                    $or: [
                        { name: regex },
                        { category: regex },
                        { subCategory: regex },
                        { mainCategory: regex },
                        { categoryPath: regex },
                        { tags: { $in: [regex] } }
                    ]
                }).populate("shop", "name avatar").limit(10)
            ]);

            const mappedProducts = products.map(p => ({ ...p.toObject(), type: 'product' }));
            const mappedEvents = events.map(e => ({ ...e.toObject(), type: 'event' }));

            // Combine and limit to top 15 results
            results = [...mappedProducts, ...mappedEvents]
                .sort((a, b) => (b.total_sell || 0) - (a.total_sell || 0))
                .slice(0, 15);
        }

        return res.status(200).json({
            success: true,
            results,
        });

    } catch (error) {
        console.error("Error in searchProducts:", error);
        return next(
            new ErrorHandler("Failed to search products! " + error.message, 500),
        );
    }
});

// delete product by id
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        if (Array.isArray(product.images) && product.images.length > 0) {
            await Promise.all(
                product.images.map(img => deleteFromCloudinary(img.public_id))
            );
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        return next(
            new ErrorHandler("Failed to delete product! " + error.message, 500),
        );
    }
});

// update product by id (seller only)
const updateProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;
        const sellerId = req.seller._id;

        const product = await Product.findById(productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Verify product belongs to seller shop
        if (product.shop.toString() !== sellerId.toString()) {
            return next(new ErrorHandler("Not authorized to update this product", 403));
        }

        const {
            name,
            description,
            category,
            mainCategory,
            subCategory,
            categoryPath,
            tags,
            stock,
            price,
            discount_price,
            isFeatured,
        } = req.body;

        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (mainCategory !== undefined) product.mainCategory = mainCategory;
        if (subCategory !== undefined) product.subCategory = subCategory;
        if (categoryPath !== undefined) {
            product.categoryPath = categoryPath;
        } else if (category || mainCategory || subCategory) {
            const parts = [
                mainCategory !== undefined ? mainCategory : product.mainCategory,
                subCategory !== undefined ? subCategory : product.subCategory,
                category !== undefined ? category : product.category,
            ].filter(Boolean);
            product.categoryPath = parts.join(" > ");
        }
        if (tags) product.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
        if (stock !== undefined && stock !== null) product.stock = Number(stock);
        if (price !== undefined && price !== null) product.price = Number(price);
        if (discount_price !== undefined && discount_price !== null) product.discount_price = Number(discount_price);
        if (isFeatured !== undefined) {
            product.isFeatured = isFeatured === "true" || isFeatured === true;
        }

        // Handle replacement/additional images if uploaded
        if (req.files && req.files.length > 0) {
            // Delete old images from Cloudinary
            if (Array.isArray(product.images) && product.images.length > 0) {
                await Promise.allSettled(
                    product.images.map(img => deleteFromCloudinary(img.public_id))
                );
            }
            const uploadPromises = req.files.map(file => uploadToCloudinary(file, "mocco/products"));
            product.images = await Promise.all(uploadPromises);
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        return next(
            new ErrorHandler("Failed to update product! " + error.message, 500),
        );
    }
});

// add or update review for product or event (user only)
const addReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { rating, comment, productId, orderId } = req.body;
        const userId = req.user._id;

        if (!rating || !productId) {
            return next(new ErrorHandler("Rating and product ID are required!", 400));
        }

        const numericRating = Number(rating);
        if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return next(new ErrorHandler("Rating must be a number between 1 and 5!", 400));
        }

        // Verify order exists, belongs to user, and contains this product/event
        if (orderId) {
            const order = await Order.findById(orderId);
            if (!order) {
                return next(new ErrorHandler("Order not found!", 404));
            }
            if (order.user.toString() !== userId.toString()) {
                return next(new ErrorHandler("You are not authorized to review this order!", 403));
            }
            const hasItem = order.items.some(
                (item) => item.productId.toString() === productId.toString()
            );
            if (!hasItem) {
                return next(new ErrorHandler("This item was not part of the specified order!", 400));
            }
        } else {
            // Check if user has ANY delivered order with this product
            const hasPurchased = await Order.findOne({
                user: userId,
                "items.productId": productId,
                status: "Delivered",
            });
            if (!hasPurchased) {
                return next(new ErrorHandler("You can only review products from delivered orders!", 400));
            }
        }

        // Try to find as Product, then as Event
        let item = await Product.findById(productId);
        let itemType = "product";
        if (!item) {
            item = await Event.findById(productId);
            itemType = "event";
        }

        if (!item) {
            return next(new ErrorHandler("Product or Event not found!", 404));
        }

        // Check if user has already reviewed this item
        const existingReviewIndex = item.reviews.findIndex(
            (r) => r.user.toString() === userId.toString()
        );

        if (existingReviewIndex !== -1) {
            // Update existing review
            item.reviews[existingReviewIndex].rating = numericRating;
            item.reviews[existingReviewIndex].comment = comment || "";
            if (orderId) item.reviews[existingReviewIndex].orderId = orderId;
            item.reviews[existingReviewIndex].createdAt = Date.now();
        } else {
            // Add new review
            item.reviews.push({
                user: userId,
                rating: numericRating,
                comment: comment || "",
                orderId: orderId || null,
                createdAt: Date.now(),
            });
        }

        // Recalculate product average rating
        const totalRating = item.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        item.rating = item.reviews.length > 0 ? Number((totalRating / item.reviews.length).toFixed(1)) : 0;

        await item.save();

        // Recalculate overall Shop rating from all products + events belonging to this shop
        const shopId = item.shop;
        if (shopId) {
            const [shopProducts, shopEvents] = await Promise.all([
                Product.find({ shop: shopId }, "reviews"),
                Event.find({ shop: shopId }, "reviews"),
            ]);

            const allShopReviews = [
                ...shopProducts.flatMap((p) => p.reviews || []),
                ...shopEvents.flatMap((e) => e.reviews || []),
            ];

            const shopTotalRating = allShopReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
            const shopAvgRating = allShopReviews.length > 0
                ? Number((shopTotalRating / allShopReviews.length).toFixed(1))
                : 0;

            await Shop.findByIdAndUpdate(shopId, { ratings: shopAvgRating });
        }

        return res.status(200).json({
            success: true,
            message: existingReviewIndex !== -1 ? "Review updated successfully!" : "Review added successfully!",
            itemType,
            rating: item.rating,
            reviewsCount: item.reviews.length,
        });
    } catch (error) {
        console.error("Error in addReview:", error);
        return next(
            new ErrorHandler("Failed to submit review! " + error.message, 500),
        );
    }
});

export {
    createProduct,
    updateProduct,
    getAllProducts,
    getFeaturedProducts,
    getBestSellingProducts,
    getProductById,
    toggleFeatured,
    getShopProducts,
    deleteProduct,
    searchProducts,
    addReview,
};
