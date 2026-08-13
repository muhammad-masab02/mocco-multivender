import express from "express";
import isAdminAuthenticated from "../middlewares/adminAuth.js";
import {
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
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// use isAdminAuthenticated middleware for all routes in this router
adminRouter.use(isAdminAuthenticated);

// All routes protected by isAdminAuthenticated
adminRouter.get("/dashboard/stats", getDashboardStats);

adminRouter.get("/users", getAllUsers);
adminRouter.delete("/users/:userId", deleteUser);

adminRouter.get("/sellers", getAllSellers);
adminRouter.delete("/sellers/:sellerId", deleteSeller);

adminRouter.get("/products", getAllProducts);
adminRouter.get("/events", getAllEvents);
adminRouter.get("/orders", getAllOrders);

adminRouter.get("/withdraw-requests", getWithdrawRequests);
adminRouter.patch("/withdraw-requests/:requestId", updateWithdrawStatus);

export default adminRouter;
