import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const isUserAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.cookies?.admin_token ||
            req.cookies?.user_token ||
            (req.headers?.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers?.authorization) ||
            req.headers?.["admin_token"] ||
            req.headers?.["user_token"] ||
            req.headers?.["x-access-token"];

        if (!token) {
            return next(new ErrorHandler("Unauthorized! No token provided.", 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return next(new ErrorHandler("Unauthorized! User not found.", 401));
        }

        next();
    } catch (error) {
        console.error("Error in isUserAuthenticated middleware:", error);
        return next(new ErrorHandler("Unauthorized! Invalid token.", 401));
    }
};

export default isUserAuthenticated;