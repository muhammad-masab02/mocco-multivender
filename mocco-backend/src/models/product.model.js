import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter product name!"],
        },
        description: {
            type: String,
            required: [true, "Please enter product description!"],
        },
        category: {
            type: String,
            required: [true, "Please enter product category!"],
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
        tags: {
            type: [String],
            required: [true, "Please enter product tags!"],
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock!"],
        },
        price: {
            type: Number,
            required: [true, "Please enter product price!"],

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
        isFeatured: {
            type: Boolean,
            default: false,
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

productSchema.index({ category: 1 });
productSchema.index({ mainCategory: 1 });
productSchema.index({ subCategory: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;