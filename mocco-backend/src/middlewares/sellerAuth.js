import Shop from "../models/shop.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const isSellerAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.cookies?.seller_token ||
            (req.headers?.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers?.authorization) ||
            req.headers?.["seller_token"] ||
            req.headers?.["x-access-token"];

        if (!token) {
            return next(new ErrorHandler("Unauthorized! No token provided.", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.seller = await Shop.findById(decoded.id).select("-password");

        if (!req.seller) {
            return next(new ErrorHandler("Unauthorized! Seller not found.", 401));
        }

        next();
    } catch (error) {
        console.error("Error in isSellerAuthenticated middleware:", error);
        return next(new ErrorHandler("Unauthorized! Invalid token.", 401));
    }
};

export default isSellerAuthenticated;