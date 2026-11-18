import express from "express";
import isAdminAuthenticated from "../middlewares/adminAuth.js";
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
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

// ── Public Admin Routes ──────────────────────────────────────────────────────
adminRouter.post("/login", loginAdmin);
adminRouter.get("/logout", logoutAdmin);
adminRouter.post("/logout", logoutAdmin);

// ── Protected Admin Routes ───────────────────────────────────────────────────
// use isAdminAuthenticated middleware for all following routes
adminRouter.use(isAdminAuthenticated);

adminRouter.get("/me", getAdminProfile);
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
