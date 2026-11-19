import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSellerAuthenticated: false,
    isLoading: true,
    updateLoading: false,
    seller: null,
    error: null,
    success: false,

    // Dashboard stats
    stats: null,
    statsLoading: false,
    statsError: null,

    // All public sellers
    allSellers: [],
    allSellersLoading: false,
    allSellersError: null,
};

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        loadSellerRequest: (state) => {
            state.isLoading = true;
        },
        loadSellerSuccess: (state, action) => {
            state.isLoading = false;
            state.isSellerAuthenticated = Boolean(action.payload);
            state.seller = action.payload;
            state.error = null;
        },
        loadSellerFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isSellerAuthenticated = false;
            state.seller = null;
        },
        // Update seller info
        updateSellerRequest: (state) => {
            state.updateLoading = true;
            state.error = null;
            state.success = false;
        },
        updateSellerSuccess: (state, action) => {
            state.updateLoading = false;
            state.seller = action.payload;
            state.error = null;
            state.success = true;
        },
        updateSellerFail: (state, action) => {
            state.updateLoading = false;
            state.error = action.payload;
            state.success = false;
        },
        // Dashboard stats
        fetchStatsRequest: (state) => {
            state.statsLoading = true;
            state.statsError = null;
        },
        fetchStatsSuccess: (state, action) => {
            state.statsLoading = false;
            state.stats = action.payload;
        },
        fetchStatsFail: (state, action) => {
            state.statsLoading = false;
            state.statsError = action.payload;
        },
        // Public sellers list
        getAllSellersRequest: (state) => {
            state.allSellersLoading = true;
            state.allSellersError = null;
        },
        getAllSellersSuccess: (state, action) => {
            state.allSellersLoading = false;
            state.allSellers = action.payload;
            state.allSellersError = null;
        },
        getAllSellersFail: (state, action) => {
            state.allSellersLoading = false;
            state.allSellersError = action.payload;
        },
        // Seller Logout Reducer
        sellerLogoutSuccess: (state) => {
            state.isLoading = false;
            state.isSellerAuthenticated = false;
            state.seller = null;
            state.error = null;
            state.stats = null;
        },
        // Clear error utility
        clearErrors: (state) => {
            state.error = null;
            state.success = false;
        }
    },
});

export const {
    loadSellerRequest,
    loadSellerSuccess,
    loadSellerFail,
    updateSellerRequest,
    updateSellerSuccess,
    updateSellerFail,
    fetchStatsRequest,
    fetchStatsSuccess,
    fetchStatsFail,
    getAllSellersRequest,
    getAllSellersSuccess,
    getAllSellersFail,
    sellerLogoutSuccess,
    clearErrors
} = sellerSlice.actions;

export default sellerSlice.reducer;