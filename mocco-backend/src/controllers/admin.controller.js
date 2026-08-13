import catchAsyncErrors from "../middlewares/CatchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import Product from "../models/product.model.js";
import Event from "../models/event.model.js";
import Order from "../models/order.model.js";
import Withdraw from "../models/withdraw.model.js";

// ─── GET /api/v1/admin/dashboard/stats ───────────────────────────────────────
const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Shop.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingWithdrawals = await Withdraw.countDocuments({ status: "Processing" });

    // Calculate total platform earnings & total gross sales from Delivered orders
    const deliveredOrders = await Order.find({ status: "Delivered" });
    const grossSales = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const platformEarnings = grossSales * 0.1; // 10% platform fee

    // Latest 10 orders across platform
    const latestOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalEvents,
        totalOrders,
        pendingWithdrawals,
        grossSales,
        platformEarnings,
        latestOrders,
      },
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    return next(new ErrorHandler("Failed to fetch admin stats! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/users ──────────────────────────────────────────────────
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return next(new ErrorHandler("Failed to fetch users! " + error.message, 500));
  }
});

// ─── DELETE /api/v1/admin/users/:userId ───────────────────────────────────────
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId.toString() === req.user._id.toString()) {
      return next(new ErrorHandler("You cannot delete your own admin account!", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return next(new ErrorHandler("Failed to delete user! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/sellers ────────────────────────────────────────────────
const getAllSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    const sellers = await Shop.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error("Error in getAllSellers:", error);
    return next(new ErrorHandler("Failed to fetch sellers! " + error.message, 500));
  }
});

// ─── DELETE /api/v1/admin/sellers/:sellerId ──────────────────────────────────
const deleteSeller = catchAsyncErrors(async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const seller = await Shop.findById(sellerId);
    if (!seller) {
      return next(new ErrorHandler("Seller shop not found!", 404));
    }

    // Delete seller shop, and optionally products owned by shop
    await Shop.findByIdAndDelete(sellerId);
    await Product.deleteMany({ shop: sellerId });
    await Event.deleteMany({ shop: sellerId });

    res.status(200).json({
      success: true,
      message: "Seller shop and associated products deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleteSeller:", error);
    return next(new ErrorHandler("Failed to delete seller! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/products ──────────────────────────────────────────────
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("shop", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return next(new ErrorHandler("Failed to fetch products! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/events ─────────────────────────────────────────────────
const getAllEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate("shop", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    return next(new ErrorHandler("Failed to fetch events! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/orders ─────────────────────────────────────────────────
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "items.productId",
        select: "name price images shop",
        populate: {
          path: "shop",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return next(new ErrorHandler("Failed to fetch orders! " + error.message, 500));
  }
});

// ─── GET /api/v1/admin/withdraw-requests ─────────────────────────────────────
const getWithdrawRequests = catchAsyncErrors(async (req, res, next) => {
  try {
    const withdrawRequests = await Withdraw.find()
      .populate("seller", "name email avatar phoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      withdrawRequests,
    });
  } catch (error) {
    console.error("Error in getWithdrawRequests:", error);
    return next(new ErrorHandler("Failed to fetch withdraw requests! " + error.message, 500));
  }
});

// ─── PATCH /api/v1/admin/withdraw-requests/:requestId ─────────────────────────
const updateWithdrawStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["Processing", "Approved", "Rejected"].includes(status)) {
      return next(new ErrorHandler("Invalid status value! Must be Processing, Approved, or Rejected.", 400));
    }

    const withdraw = await Withdraw.findById(requestId).populate("seller", "name email");
    if (!withdraw) {
      return next(new ErrorHandler("Withdraw request not found!", 404));
    }

    withdraw.status = status;
    await withdraw.save();

    res.status(200).json({
      success: true,
      message: `Withdrawal request status updated to "${status}".`,
      withdraw,
    });
  } catch (error) {
    console.error("Error in updateWithdrawStatus:", error);
    return next(new ErrorHandler("Failed to update withdraw status! " + error.message, 500));
  }
});

export {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllSellers,
  deleteSeller,
  getAllProducts,
  getAllEvents,
  getAllOrders,
  getWithdrawRequests,
  updateWithdrawStatus,
};
