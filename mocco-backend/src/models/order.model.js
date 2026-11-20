import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        index: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            refPath: "items.itemModel",
            required: true
        },
        itemModel: {
            type: String,
            enum: ["Product", "Event"],
            default: "Product"
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "Shop"
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            "Pending Payment",
            "Processing",
            "Ready for Pickup",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Processing Refund",
            "Refund Success",
            "Cancelled",
            "Returned"
        ],
        default: "Processing"
    },
    shippingAddress: {
        type: Object,
        required: true
    },
    paymentInfo: {
        transactionId: {
            type: String
        },
        method: {
            type: String,
            enum: ["Credit Card", "PayPal", "Cash on Delivery", "Bank Transfer"],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["Paid", "Unpaid", "Refunded"],
            default: "Unpaid"
        }
    },
    paidAt: {
        type: Date,
        default: Date.now(),
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;