import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Dashboard stats
  stats: null,
  isStatsLoading: false,
  statsError: null,

  // Users
  users: [],
  isUsersLoading: false,
  usersError: null,

  // Sellers
  sellers: [],
  isSellersLoading: false,
  sellersError: null,

  // Products
  products: [],
  isProductsLoading: false,
  productsError: null,

  // Events
  events: [],
  isEventsLoading: false,
  eventsError: null,

  // Orders
  orders: [],
  isOrdersLoading: false,
  ordersError: null,

  // Withdraw Requests
  withdrawRequests: [],
  isWithdrawLoading: false,
  withdrawError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Dashboard stats
    statsRequest: (state) => {
      state.isStatsLoading = true;
      state.statsError = null;
    },
    statsSuccess: (state, action) => {
      state.isStatsLoading = false;
      state.stats = action.payload;
    },
    statsFail: (state, action) => {
      state.isStatsLoading = false;
      state.statsError = action.payload;
    },

    // Users
    usersRequest: (state) => {
      state.isUsersLoading = true;
      state.usersError = null;
    },
    usersSuccess: (state, action) => {
      state.isUsersLoading = false;
      state.users = action.payload;
    },
    usersFail: (state, action) => {
      state.isUsersLoading = false;
      state.usersError = action.payload;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },

    // Sellers
    sellersRequest: (state) => {
      state.isSellersLoading = true;
      state.sellersError = null;
    },
    sellersSuccess: (state, action) => {
      state.isSellersLoading = false;
      state.sellers = action.payload;
    },
    sellersFail: (state, action) => {
      state.isSellersLoading = false;
      state.sellersError = action.payload;
    },
    deleteSellerSuccess: (state, action) => {
      state.sellers = state.sellers.filter((s) => s._id !== action.payload);
    },

    // Products
    productsRequest: (state) => {
      state.isProductsLoading = true;
      state.productsError = null;
    },
    productsSuccess: (state, action) => {
      state.isProductsLoading = false;
      state.products = action.payload;
    },
    productsFail: (state, action) => {
      state.isProductsLoading = false;
      state.productsError = action.payload;
    },

    // Events
    eventsRequest: (state) => {
      state.isEventsLoading = true;
      state.eventsError = null;
    },
    eventsSuccess: (state, action) => {
      state.isEventsLoading = false;
      state.events = action.payload;
    },
    eventsFail: (state, action) => {
      state.isEventsLoading = false;
      state.eventsError = action.payload;
    },

    // Orders
    ordersRequest: (state) => {
      state.isOrdersLoading = true;
      state.ordersError = null;
    },
    ordersSuccess: (state, action) => {
      state.isOrdersLoading = false;
      state.orders = action.payload;
    },
    ordersFail: (state, action) => {
      state.isOrdersLoading = false;
      state.ordersError = action.payload;
    },

    // Withdraw Requests
    withdrawRequest: (state) => {
      state.isWithdrawLoading = true;
      state.withdrawError = null;
    },
    withdrawSuccess: (state, action) => {
      state.isWithdrawLoading = false;
      state.withdrawRequests = action.payload;
    },
    withdrawFail: (state, action) => {
      state.isWithdrawLoading = false;
      state.withdrawError = action.payload;
    },
    updateWithdrawSuccess: (state, action) => {
      const updated = action.payload;
      state.withdrawRequests = state.withdrawRequests.map((r) =>
        r._id === updated._id ? updated : r
      );
    },
  },
});

export const {
  statsRequest, statsSuccess, statsFail,
  usersRequest, usersSuccess, usersFail, deleteUserSuccess,
  sellersRequest, sellersSuccess, sellersFail, deleteSellerSuccess,
  productsRequest, productsSuccess, productsFail,
  eventsRequest, eventsSuccess, eventsFail,
  ordersRequest, ordersSuccess, ordersFail,
  withdrawRequest, withdrawSuccess, withdrawFail, updateWithdrawSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
