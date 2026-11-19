// user routes
import express from "express";
import {
  activateShopEmail,
  getSeller,
  getShopInfo,
  loginShop,
  logoutShop,
  registerShop,
  updateSellerInfo,
  getDashboardStats,
  getAllSellersPublic,
} from "../controllers/shop.controller.js";
import upload from "../../multer.js";
import isSellerAuthenticated from "../middlewares/sellerAuth.js";

const shopRouter = express.Router();

shopRouter.get("/all-sellers", getAllSellersPublic);
shopRouter.get("/sellers", getAllSellersPublic);
shopRouter.post("/register", upload.single("file"), registerShop);
shopRouter.post("/activate", activateShopEmail);
shopRouter.post("/login", loginShop);
shopRouter.get("/seller", isSellerAuthenticated, getSeller);
shopRouter.get("/info/:shopId", getShopInfo);
shopRouter.get("/logout", logoutShop);
shopRouter.put(
  "/update-seller-info",
  isSellerAuthenticated,
  upload.single("file"),
  updateSellerInfo,
);
shopRouter.get("/dashboard-stats", isSellerAuthenticated, getDashboardStats);

export default shopRouter;
