import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // These replace your LoadUserRequest, LoadUserSuccess, etc.
    loadUserRequest: (state) => {
      state.isLoading = true;
    },
    loadUserSuccess: (state, action) => {
      state.isLoading = false;
      state.isUserAuthenticated = true;
      state.user = action.payload;
    },
    loadUserFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isUserAuthenticated = false;
      state.user = null;
    },
    // Update Profile Reducers
    updateProfileRequest: (state) => {
      state.isLoading = true;
    },
    updateProfileSuccess: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.user = action.payload; // Update user object in state
      }
    },
    updateProfileFail: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // User Logout Reducer
    userLogoutSuccess: (state) => {
      state.isLoading = false;
      state.isUserAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    // Clear error utility
    clearErrors: (state) => {
      state.error = null;
    }
  },
});

export const {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  userLogoutSuccess,
  clearErrors
} = userSlice.actions;

export default userSlice.reducer;