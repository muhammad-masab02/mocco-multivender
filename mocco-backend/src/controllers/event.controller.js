import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Event from "../models/event.model.js";
import Shop from "../models/shop.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// create event
const createEvent = catchAsyncErrors(async (req, res, next) => {
    try {

        const shop = req.seller; // get shop from authenticated seller

        const {
            name,
            description,
            category,
            startDate,
            endDate,
            status,
            tags,
            stock,
            price,
            discount_price,
            total_sell,
        } = req.body;

        // 2. Check if product already exists (same name in same shop)
        const existingEvent = await Event.findOne({
            name,
            shop: shop._id,
        });

        if (existingEvent) {
            return res.status(400).json({
                success: false,
                message: "Event already exists in your shop",
            });
        }

        // 3. Handle images via Cloudinary
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler("Please upload at least one image for the event.", 400));
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file, "mocco/events"));
        const images = await Promise.all(uploadPromises);

        // 4. Create event
        const event = await Event.create({
            name,
            description,
            category,
            startDate,
            endDate,
            status,
            tags: tags ? tags.split(",") : [],
            stock,
            price,
            discount_price,
            images,
            total_sell: Number(total_sell) || 0,
            shop: shop._id, // link event to shop
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    }
    catch (error) {
        console.error("Error in createEvent:", error);
        return next(
            new ErrorHandler("Failed to create event! " + error.message, 500),
        );
    }
});

// get all events for a shop
const getShopEvents = catchAsyncErrors(async (req, res, next) => {
    try {
        // 1. Find the shop of the authenticated seller
        const sellerId = req.params.shopId; // Get shopId from route params

        const shop = await Shop.findOne({ _id: sellerId });

        if (!shop) {
            return next(new ErrorHandler("Shop not found for this seller", 404));
        }

        const events = await Event.find({ shop: sellerId });

        return res.status(200).json({
            success: true,
            events,
        });

    } catch (error) {
        console.error("Error in getShopEvents:", error);
        return next(
            new ErrorHandler("Failed to fetch events! " + error.message, 500)
        );
    }
});

// get all active events across shops (for homepage)
const getAllEvents = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();

        const events = await Event.find({
            status: "Running",
            startDate: { $lte: now },
            endDate: { $gte: now },
            stock: { $gt: 0 },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error in getAllEvents:", error);
        return next(
            new ErrorHandler("Failed to fetch events! " + error.message, 500),
        );
    }
});

// delete event by id
const deleteEvent = catchAsyncErrors(async (req, res, next) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        if (Array.isArray(event.images) && event.images.length > 0) {
            await Promise.all(
                event.images.map(img => deleteFromCloudinary(img.public_id))
            );
        }

        await Event.findByIdAndDelete(eventId);

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteEvent:", error);
        return next(
            new ErrorHandler("Failed to delete event! " + error.message, 500)
        );
    }
});

// update event by id (seller only)
const updateEvent = catchAsyncErrors(async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const sellerId = req.seller._id;

        const event = await Event.findById(eventId);

        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        if (event.shop.toString() !== sellerId.toString()) {
            return next(new ErrorHandler("Not authorized to update this event", 403));
        }

        const {
            name,
            description,
            category,
            startDate,
            endDate,
            status,
            tags,
            stock,
            price,
            discount_price,
        } = req.body;

        if (name) event.name = name;
        if (description) event.description = description;
        if (category) event.category = category;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;
        if (status) event.status = status;
        if (tags) event.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
        if (stock !== undefined && stock !== null) event.stock = Number(stock);
        if (price !== undefined && price !== null) event.price = Number(price);
        if (discount_price !== undefined && discount_price !== null) event.discount_price = Number(discount_price);

        // Handle replacement images
        if (req.files && req.files.length > 0) {
            if (Array.isArray(event.images) && event.images.length > 0) {
                await Promise.allSettled(
                    event.images.map(img => deleteFromCloudinary(img.public_id))
                );
            }
            const uploadPromises = req.files.map(file => uploadToCloudinary(file, "mocco/events"));
            event.images = await Promise.all(uploadPromises);
        }

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        console.error("Error in updateEvent:", error);
        return next(
            new ErrorHandler("Failed to update event! " + error.message, 500)
        );
    }
});

export { createEvent, updateEvent, getShopEvents, getAllEvents, deleteEvent };