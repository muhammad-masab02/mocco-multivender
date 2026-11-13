import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getFeaturedProducts,
    getBestSellingProducts,
    getProductById,
    getShopProducts,
    toggleFeatured,
    searchProducts,
    addReview,
} from "../controllers/product.controller.js";
import isSellerAuthenticated from "../middlewares/sellerAuth.js";
import isUserAuthenticated from "../middlewares/userAuth.js";
import upload from "../../multer.js";

const productRouter = express.Router();

productRouter.post(
    "/create",
    isSellerAuthenticated,
    upload.array("files", 10),
    createProduct,
);

productRouter.get("/all-products", getAllProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/featured", getFeaturedProducts);
productRouter.get("/best-selling", getBestSellingProducts);
productRouter.get("/detail/:id", getProductById);
productRouter.get("/all/:shopId", getShopProducts);

productRouter.patch("/toggle-featured/:id", isSellerAuthenticated, toggleFeatured);
productRouter.put(
    "/update/:id",
    isSellerAuthenticated,
    upload.array("files", 10),
    updateProduct,
);
productRouter.put("/add-review", isUserAuthenticated, addReview);
productRouter.delete("/delete/:id", isSellerAuthenticated, deleteProduct);

export default productRouter;