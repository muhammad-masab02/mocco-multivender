import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.admin_token ||
      req.cookies?.user_token ||
      req.headers?.authorization?.replace(/^Bearer\s+/i, "") ||
      req.headers?.["admin_token"] ||
      req.headers?.["user_token"] ||
      req.headers?.["x-access-token"];

    if (!token) {
      return next(new ErrorHandler("Unauthorized! Please login as an admin.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ErrorHandler("Unauthorized! User not found.", 401));
    }

    if (String(user.role || "").toLowerCase() !== "admin") {
      return next(new ErrorHandler("Access denied! Admin privileges required.", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isAdminAuthenticated middleware:", error);
    return next(new ErrorHandler("Unauthorized! Invalid or expired token.", 401));
  }
};

export default isAdminAuthenticated;
