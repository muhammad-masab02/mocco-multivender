import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            refPath: "items.itemModel",
            required: [true, "Product ID is required"],
        },
        // "Product" for normal products, "Event" for event products
        // defaults to "Product" so legacy cart items are unaffected
        itemModel: {
            type: String,
            enum: ["Product", "Event"],
            default: "Product",
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity cannot be less than 1"],
            default: 1,
        },
    },
    { _id: false } // No need for separate _id for each item in the array
);

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            unique: true, // One cart per user
            index: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
