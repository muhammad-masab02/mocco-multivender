import express from "express";
import upload from "../../multer.js";
import isAdminAuthenticated from "../middlewares/adminAuth.js";
import {
    getCategoryTree,
    getFlatCategories,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    resetDefaultCategories,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

// ── Public Category Routes ───────────────────────────────────────────────────
categoryRouter.get("/tree", getCategoryTree);
categoryRouter.get("/flat", getFlatCategories);

// ── Protected Admin Category Routes ──────────────────────────────────────────
categoryRouter.post(
    "/admin/create",
    isAdminAuthenticated,
    upload.single("image"),
    createCategory
);

categoryRouter.put(
    "/admin/update/:id",
    isAdminAuthenticated,
    upload.single("image"),
    updateCategory
);

categoryRouter.patch(
    "/admin/toggle/:id",
    isAdminAuthenticated,
    toggleCategoryStatus
);

categoryRouter.delete(
    "/admin/delete/:id",
    isAdminAuthenticated,
    deleteCategory
);

categoryRouter.post(
    "/admin/reset-default",
    isAdminAuthenticated,
    resetDefaultCategories
);

export default categoryRouter;
