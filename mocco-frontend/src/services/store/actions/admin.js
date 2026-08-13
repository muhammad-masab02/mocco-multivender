import axios from "axios";
import {
  statsRequest, statsSuccess, statsFail,
  usersRequest, usersSuccess, usersFail, deleteUserSuccess,
  sellersRequest, sellersSuccess, sellersFail, deleteSellerSuccess,
  productsRequest, productsSuccess, productsFail,
  eventsRequest, eventsSuccess, eventsFail,
  ordersRequest, ordersSuccess, ordersFail,
  withdrawRequest, withdrawSuccess, withdrawFail, updateWithdrawSuccess,
} from "../slices/adminSlice";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper
const api = axios.create({ baseURL: API_URL, withCredentials: true });

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
