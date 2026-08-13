import express from "express";
import isSellerAuthenticated from "../middlewares/sellerAuth.js";
import {
  createWithdrawRequest,
  getSellerWithdrawals,
} from "../controllers/withdraw.controller.js";

const withdrawRouter = express.Router();

// use isSellerAuthenticated middleware for all routes in this router
withdrawRouter.use(isSellerAuthenticated);

withdrawRouter.post("/create-withdraw", createWithdrawRequest);
withdrawRouter.get("/seller-withdrawals", getSellerWithdrawals);

export default withdrawRouter;
