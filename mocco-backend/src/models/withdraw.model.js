import mongoose, { Schema } from "mongoose";

const withdrawSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Please enter withdrawal amount!"],
    },
    fee: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    bankInfo: {
      bankName: {
        type: String,
        required: true,
      },
      accountHolderName: {
        type: String,
        required: true,
      },
      accountMasked: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["Processing", "Approved", "Rejected"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
