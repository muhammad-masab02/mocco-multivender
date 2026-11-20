import axios from "axios";
import {
    categoryRequest,
    categorySuccess,
    categoryFail,
    categoryActionSuccess,
} from "../slices/categorySlice";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        try {
            const adminToken = localStorage.getItem("admin_token");
            if (adminToken) {
                config.headers["admin_token"] = adminToken;
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${adminToken}`;
                }
            }
        } catch {
            // localStorage unavailable
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 1. Get Category Tree (Main -> Sub -> Categories)
export const getCategoryTree = (includeAll = false) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const { data } = await api.get(`/category/tree?all=${includeAll}`);
        dispatch(categorySuccess({ tree: data.tree, stats: data.stats }));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch categories";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 2. Get Flat Categories with optional filters
export const getFlatCategories = (params = {}) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const { data } = await api.get("/category/flat", { params });
        dispatch(categorySuccess({ categories: data.categories }));
        return data.categories;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch categories";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 3. Create Category (Admin)
export const createCategory = (formData) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const isFormData = formData instanceof FormData;
        const config = isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : {};
        const { data } = await api.post("/category/admin/create", formData, config);
        dispatch(categoryActionSuccess(data.message));
        // Refresh tree after creation
        dispatch(getCategoryTree(true));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create category";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 4. Update Category (Admin)
export const updateCategory = (id, formData) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const isFormData = formData instanceof FormData;
        const config = isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : {};
        const { data } = await api.put(`/category/admin/update/${id}`, formData, config);
        dispatch(categoryActionSuccess(data.message));
        dispatch(getCategoryTree(true));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update category";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 5. Toggle Category Status (Active/Inactive) (Admin)
export const toggleCategoryStatus = (id) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const { data } = await api.patch(`/category/admin/toggle/${id}`);
        dispatch(categoryActionSuccess(data.message));
        dispatch(getCategoryTree(true));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update category status";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 6. Delete Category (Admin)
export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const { data } = await api.delete(`/category/admin/delete/${id}`);
        dispatch(categoryActionSuccess(data.message));
        dispatch(getCategoryTree(true));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to delete category";
        dispatch(categoryFail(message));
        throw error;
    }
};

// 7. Reset / Re-seed default hierarchy (Admin)
export const resetDefaultCategories = () => async (dispatch) => {
    try {
        dispatch(categoryRequest());
        const { data } = await api.post("/category/admin/reset-default");
        dispatch(categoryActionSuccess(data.message));
        dispatch(getCategoryTree(true));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to reset default categories";
        dispatch(categoryFail(message));
        throw error;
    }
};
