import axios from "axios";
import toast from "react-hot-toast";
import {
  statsRequest, statsSuccess, statsFail,
  usersRequest, usersSuccess, usersFail, deleteUserSuccess,
  sellersRequest, sellersSuccess, sellersFail, deleteSellerSuccess,
  productsRequest, productsSuccess, productsFail,
  eventsRequest, eventsSuccess, eventsFail,
  ordersRequest, ordersSuccess, ordersFail,
  withdrawRequest, withdrawSuccess, withdrawFail, updateWithdrawSuccess,
} from "../slices/adminSlice";
import { userLogoutSuccess } from "../slices/userAuthSlice";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper axios instance with credentials and token header injection
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
      // Ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const fetchAdminStats = () => async (dispatch) => {
  dispatch(statsRequest());
  try {
    const { data } = await api.get("/admin/dashboard/stats");
    dispatch(statsSuccess(data.stats));
  } catch (err) {
    dispatch(statsFail(err.response?.data?.message || err.message));
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(usersRequest());
  try {
    const { data } = await api.get("/admin/users");
    dispatch(usersSuccess(data.users));
  } catch (err) {
    dispatch(usersFail(err.response?.data?.message || err.message));
  }
};

export const deleteAdminUser = (userId) => async (dispatch) => {
  try {
    await api.delete(`/admin/users/${userId}`);
    dispatch(deleteUserSuccess(userId));
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// ─── Sellers ──────────────────────────────────────────────────────────────────
export const fetchAllSellers = () => async (dispatch) => {
  dispatch(sellersRequest());
  try {
    const { data } = await api.get("/admin/sellers");
    dispatch(sellersSuccess(data.sellers));
  } catch (err) {
    dispatch(sellersFail(err.response?.data?.message || err.message));
  }
};

export const deleteAdminSeller = (sellerId) => async (dispatch) => {
  try {
    await api.delete(`/admin/sellers/${sellerId}`);
    dispatch(deleteSellerSuccess(sellerId));
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const fetchAllAdminProducts = () => async (dispatch) => {
  dispatch(productsRequest());
  try {
    const { data } = await api.get("/admin/products");
    dispatch(productsSuccess(data.products));
  } catch (err) {
    dispatch(productsFail(err.response?.data?.message || err.message));
  }
};

// ─── Events ───────────────────────────────────────────────────────────────────
export const fetchAllAdminEvents = () => async (dispatch) => {
  dispatch(eventsRequest());
  try {
    const { data } = await api.get("/admin/events");
    dispatch(eventsSuccess(data.events));
  } catch (err) {
    dispatch(eventsFail(err.response?.data?.message || err.message));
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const fetchAllAdminOrders = () => async (dispatch) => {
  dispatch(ordersRequest());
  try {
    const { data } = await api.get("/admin/orders");
    dispatch(ordersSuccess(data.orders));
  } catch (err) {
    dispatch(ordersFail(err.response?.data?.message || err.message));
  }
};

// ─── Withdraw Requests ────────────────────────────────────────────────────────
export const fetchWithdrawRequests = () => async (dispatch) => {
  dispatch(withdrawRequest());
  try {
    const { data } = await api.get("/admin/withdraw-requests");
    dispatch(withdrawSuccess(data.withdrawRequests));
  } catch (err) {
    dispatch(withdrawFail(err.response?.data?.message || err.message));
  }
};

export const updateWithdrawRequestStatus = (requestId, status) => async (dispatch) => {
  try {
    const { data } = await api.patch(`/admin/withdraw-requests/${requestId}`, { status });
    dispatch(updateWithdrawSuccess(data.withdraw));
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.message || err.message };
  }
};

export const logoutAdmin = () => async (dispatch) => {
  try {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_token");
    await api.get("/admin/logout");
  } catch (err) {
    console.error("Admin logout error:", err);
  } finally {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("user_token");
    dispatch(userLogoutSuccess());
    toast.success("Admin session terminated safely.");
    return { success: true };
  }
};
