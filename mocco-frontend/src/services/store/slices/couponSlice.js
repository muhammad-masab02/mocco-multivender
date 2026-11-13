import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coupons: [],
    isLoading: false,
    error: null,
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        // create coupon
        createCouponRequest: (state) => {
            state.isLoading = true;
        },
        createCouponSuccess: (state, action) => {
            state.isLoading = false;
            state.coupons.push(action.payload);
            state.error = null;
        },
        createCouponFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // update coupon
        updateCouponRequest: (state) => {
            state.isLoading = true;
        },
        updateCouponSuccess: (state, action) => {
            state.isLoading = false;
            const updated = action.payload;
            const index = state.coupons.findIndex((c) => c._id === updated._id);
            if (index !== -1) {
                state.coupons[index] = updated;
            }
            state.error = null;
        },
        updateCouponFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // get all coupons
        getCouponsRequest: (state) => {
            state.isLoading = true;
        },
        getCouponsSuccess: (state, action) => {
            state.isLoading = false;
            state.coupons = action.payload;
            state.error = null;
        },
        getCouponsFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },

        // delete coupon by id
        deleteCouponRequest: (state) => {
            state.isLoading = true;
        },
        deleteCouponSuccess: (state, action) => {
            state.isLoading = false;
            state.coupons = state.coupons.filter(
                (coupon) => coupon._id !== action.payload
            );
            state.error = null;
        },
        deleteCouponFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Clear error utility
        clearErrors: (state) => {
            state.error = null;
        }
    },
});

export const {
    createCouponRequest,
    createCouponSuccess,
    createCouponFail,
    updateCouponRequest,
    updateCouponSuccess,
    updateCouponFail,
    getCouponsRequest,
    getCouponsSuccess,
    getCouponsFail,
    deleteCouponRequest,
    deleteCouponSuccess,
    deleteCouponFail,
    clearErrors,
} = couponSlice.actions;

export default couponSlice.reducer;
