import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Withdraw from "../models/withdraw.model.js";

// POST /api/v1/withdraw/create-withdraw (seller)
const createWithdrawRequest = catchAsyncErrors(async (req, res, next) => {
  try {
    const { amount, fee, netAmount, bankInfo } = req.body;
    const sellerId = req.seller._id;

    if (!amount || !netAmount || !bankInfo) {
      return next(new ErrorHandler("Please provide all required fields!", 400));
    }

    const withdraw = await Withdraw.create({
      seller: sellerId,
      amount,
      fee: fee || 0,
      netAmount,
      bankInfo,
      status: "Processing",
    });

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully!",
      withdraw,
    });
  } catch (error) {
    console.error("Error in createWithdrawRequest:", error);
    return next(new ErrorHandler("Failed to create withdrawal request! " + error.message, 500));
  }
});

// GET /api/v1/withdraw/seller-withdrawals (seller)
const getSellerWithdrawals = catchAsyncErrors(async (req, res, next) => {
  try {
    const withdrawals = await Withdraw.find({ seller: req.seller._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error("Error in getSellerWithdrawals:", error);
    return next(new ErrorHandler("Failed to fetch withdrawals! " + error.message, 500));
  }
});

export { createWithdrawRequest, getSellerWithdrawals };
