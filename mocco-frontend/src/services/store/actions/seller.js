import axios from "axios";
import toast from "react-hot-toast";
import {
    loadSellerFail,
    loadSellerRequest,
    loadSellerSuccess,
    updateSellerFail,
    updateSellerRequest,
    updateSellerSuccess,
    fetchStatsRequest,
    fetchStatsSuccess,
    fetchStatsFail,
    sellerLogoutSuccess,
} from "../slices/sellerAuthSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loadSeller = () => async (dispatch) => {
    try {
        dispatch(loadSellerRequest());

        const { data } = await axios.get(`${backendUrl}/shop/seller`, {
            withCredentials: true,
        });

        dispatch(loadSellerSuccess(data.shop));
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load seller";

        dispatch(loadSellerFail(message));
    }
};

export const updateSellerInfo = (formData) => async (dispatch) => {
    try {
        dispatch(updateSellerRequest());

        const { data } = await axios.put(
            `${backendUrl}/shop/update-seller-info`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        dispatch(updateSellerSuccess(data.shop));
        return { success: true, message: data.message || "Shop updated successfully!", shop: data.shop };
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update shop info";

        dispatch(updateSellerFail(message));
        return { success: false, message };
    }
};

export const getDashboardStats = () => async (dispatch) => {
    try {
        dispatch(fetchStatsRequest());
        const { data } = await axios.get(`${backendUrl}/shop/dashboard-stats`, {
            withCredentials: true,
        });
        dispatch(fetchStatsSuccess(data.stats));
        return data;
    } catch (error) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch dashboard stats";
        dispatch(fetchStatsFail(message));
    }
};

export const logoutSeller = () => async (dispatch) => {
    try {
        localStorage.removeItem("seller_token");
        await axios.get(`${backendUrl}/shop/logout`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error("Seller logout error:", error);
    } finally {
        localStorage.removeItem("seller_token");
        dispatch(sellerLogoutSuccess());
        toast.success("Merchant session ended successfully");
        return { success: true };
    }
};