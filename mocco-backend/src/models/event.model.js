import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter event product name!"],
        },
        description: {
            type: String,
            required: [true, "Please enter event product description!"],
        },
        category: {
            type: String,
            required: [true, "Please enter event product category!"],
            trim: true,
        },
        mainCategory: {
            type: String,
            trim: true,
            default: "",
        },
        subCategory: {
            type: String,
            trim: true,
            default: "",
        },
        categoryPath: {
            type: String,
            trim: true,
            default: "",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            default: "Running",
        },
        tags: {
            type: [String],
            required: [true, "Please enter event product tags!"],
        },
        stock: {
            type: Number,
            required: [true, "Please enter event product stock!"],
        },
        price: {
            type: Number,
            required: [true, "Please enter event product price!"],

        },
        discount_price: {
            type: Number,
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        total_sell: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: { type: Schema.Types.ObjectId, ref: "User" },
                rating: { type: Number, required: true },
                comment: { type: String },
                orderId: { type: Schema.Types.ObjectId, ref: "Order" },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        // extra
        // shopId: {
        //     type: String,
        //     required: true,
        // },
        // shop: {
        //     type: Object,
        //     required: true,
        // }
    }, { timestamps: true });

eventSchema.index({ category: 1 });
eventSchema.index({ mainCategory: 1 });
eventSchema.index({ subCategory: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;