import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Event from "../models/event.model.js";
import Shop from "../models/shop.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * Automatically synchronizes event statuses in the database based on the current time.
 * - Any non-paused event where endDate < now -> "Ended"
 * - Any event where startDate <= now <= endDate (and not paused) -> "Running"
 * - Any event where startDate > now (and not paused) -> "Upcoming"
 */
const syncEventStatuses = async (filter = {}) => {
    try {
        const now = new Date();

        // 1. Mark past/expired events as "Ended"
        await Event.updateMany(
            {
                ...filter,
                status: { $ne: "Ended" },
                endDate: { $lt: now },
            },
            { $set: { status: "Ended" } }
        );

        // 2. Mark upcoming events as "Upcoming" if not paused or ended
        await Event.updateMany(
            {
                ...filter,
                status: { $nin: ["Paused", "Ended"] },
                startDate: { $gt: now },
            },
            { $set: { status: "Upcoming" } }
        );

        // 3. Mark active events as "Running" if start date has arrived and end date is in the future
        await Event.updateMany(
            {
                ...filter,
                status: { $in: ["Upcoming", "Draft"] },
                startDate: { $lte: now },
                endDate: { $gte: now },
            },
            { $set: { status: "Running" } }
        );
    } catch (err) {
        console.error("Error in syncEventStatuses:", err);
    }
};

/**
 * Real-time status calculator for any event document.
 */
const computeEventStatus = (event) => {
    if (!event) return "Ended";
    if (event.status === "Paused") return "Paused";

    const now = Date.now();
    const end = event.endDate ? new Date(event.endDate).getTime() : 0;
    const start = event.startDate ? new Date(event.startDate).getTime() : 0;

    if (end && end < now) return "Ended";
    if (start && start > now) return "Upcoming";
    return "Running";
};

// 1. Create Event (seller auth)
const createEvent = catchAsyncErrors(async (req, res, next) => {
    try {
        const shop = req.seller; // authenticated seller's shop

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

        if (!name || !startDate || !endDate) {
            return next(new ErrorHandler("Name, start date, and end date are required.", 400));
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return next(new ErrorHandler("Invalid start date or end date format.", 400));
        }

        if (end <= start) {
            return next(new ErrorHandler("End date must be after start date.", 400));
        }

        // Prevent duplicate event name in same shop
        const existingEvent = await Event.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
            shop: shop._id,
        });

        if (existingEvent) {
            return res.status(400).json({
                success: false,
                message: "An event with this name already exists in your shop",
            });
        }

        // Images via Cloudinary
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler("Please upload at least one image for the event.", 400));
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file, "mocco/events"));
        const images = await Promise.all(uploadPromises);

        // Derive initial status based on dates unless explicitly paused
        let initialStatus = status || "Running";
        if (initialStatus !== "Paused") {
            if (end < now) {
                initialStatus = "Ended";
            } else if (start > now) {
                initialStatus = "Upcoming";
            } else {
                initialStatus = "Running";
            }
        }

        const event = await Event.create({
            name: name.trim(),
            description,
            category,
            startDate: start,
            endDate: end,
            status: initialStatus,
            tags: tags ? (typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags) : [],
            stock: Number(stock) || 0,
            price: Number(price) || 0,
            discount_price: discount_price ? Number(discount_price) : undefined,
            images,
            total_sell: Number(total_sell) || 0,
            shop: shop._id,
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        console.error("Error in createEvent:", error);
        return next(
            new ErrorHandler("Failed to create event! " + error.message, 500),
        );
    }
});

// 2. Get All Events for a Shop (scoped to shopId)
// Supports optional ?status=Running|Ended|Upcoming or ?active=true
const getShopEvents = catchAsyncErrors(async (req, res, next) => {
    try {
        const sellerId = req.params.shopId;

        const shop = await Shop.findOne({ _id: sellerId });
        if (!shop) {
            return next(new ErrorHandler("Shop not found for this seller", 404));
        }

        // Auto-synchronize event statuses in the database
        await syncEventStatuses({ shop: sellerId });

        const now = new Date();
        const { active, status } = req.query;

        let query = { shop: sellerId };

        if (active === "true" || status === "Running") {
            query = {
                shop: sellerId,
                status: "Running",
                startDate: { $lte: now },
                endDate: { $gte: now },
            };
        } else if (status === "Ended") {
            query = {
                shop: sellerId,
                $or: [{ status: "Ended" }, { endDate: { $lt: now } }],
            };
        } else if (status === "Upcoming") {
            query = {
                shop: sellerId,
                status: "Upcoming",
                startDate: { $gt: now },
            };
        }

        const rawEvents = await Event.find(query)
            .populate("shop", "name avatar email")
            .sort({ createdAt: -1 });

        // Ensure every returned event carries accurate real-time computed status
        const events = rawEvents.map((ev) => {
            const doc = ev.toObject ? ev.toObject() : { ...ev };
            doc.status = computeEventStatus(doc);
            return doc;
        });

        return res.status(200).json({
            success: true,
            events,
            total: events.length,
        });
    } catch (error) {
        console.error("Error in getShopEvents:", error);
        return next(
            new ErrorHandler("Failed to fetch events! " + error.message, 500)
        );
    }
});

// 3. Get All Active Events Across All Shops (for homepage & global /events page)
const getAllEvents = catchAsyncErrors(async (req, res, next) => {
    try {
        const now = new Date();

        // Sync statuses across DB
        await syncEventStatuses();

        const rawEvents = await Event.find({
            status: "Running",
            startDate: { $lte: now },
            endDate: { $gte: now },
            stock: { $gt: 0 },
        })
        .populate("shop", "name avatar email")
        .sort({ createdAt: -1 });

        const events = rawEvents.map((ev) => {
            const doc = ev.toObject ? ev.toObject() : { ...ev };
            doc.status = computeEventStatus(doc);
            return doc;
        });

        return res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error in getAllEvents:", error);
        return next(
            new ErrorHandler("Failed to fetch events! " + error.message, 500),
        );
    }
});

// 4. Delete Event by ID (seller auth)
const deleteEvent = catchAsyncErrors(async (req, res, next) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return next(new ErrorHandler("Event not found", 404));
        }

        if (Array.isArray(event.images) && event.images.length > 0) {
            await Promise.allSettled(
                event.images.map(img => img?.public_id && deleteFromCloudinary(img.public_id))
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

// 5. Update Event by ID (seller auth)
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

        if (name) event.name = name.trim();
        if (description) event.description = description;
        if (category) event.category = category;
        if (startDate) event.startDate = new Date(startDate);
        if (endDate) event.endDate = new Date(endDate);
        if (tags) event.tags = typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags;
        if (stock !== undefined && stock !== null) event.stock = Number(stock);
        if (price !== undefined && price !== null) event.price = Number(price);
        if (discount_price !== undefined && discount_price !== null) event.discount_price = Number(discount_price);

        // Recalculate or honor explicit status
        const now = new Date();
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);

        if (status) {
            event.status = status;
        } else if (event.status !== "Paused") {
            if (end < now) {
                event.status = "Ended";
            } else if (start > now) {
                event.status = "Upcoming";
            } else {
                event.status = "Running";
            }
        }

        // Handle replacement images
        if (req.files && req.files.length > 0) {
            if (Array.isArray(event.images) && event.images.length > 0) {
                await Promise.allSettled(
                    event.images.map(img => img?.public_id && deleteFromCloudinary(img.public_id))
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

export {
    createEvent,
    updateEvent,
    getShopEvents,
    getAllEvents,
    deleteEvent,
    syncEventStatuses,
    computeEventStatus,
};
