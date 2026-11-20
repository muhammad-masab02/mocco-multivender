import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categoriesTree: [],
    flatCategories: [],
    stats: {
        totalCategories: 0,
        totalMain: 0,
        totalSub: 0,
        totalProductCategories: 0,
        totalActive: 0,
    },
    isLoading: false,
    error: null,
    success: false,
    message: null,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        categoryRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        categorySuccess: (state, action) => {
            state.isLoading = false;
            if (action.payload?.tree) {
                state.categoriesTree = action.payload.tree;
            }
            if (action.payload?.stats) {
                state.stats = action.payload.stats;
            }
            if (action.payload?.categories) {
                state.flatCategories = action.payload.categories;
            }
            state.error = null;
        },
        categoryFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        categoryActionSuccess: (state, action) => {
            state.isLoading = false;
            state.success = true;
            state.message = action.payload;
            state.error = null;
        },
        clearCategoryErrors: (state) => {
            state.error = null;
        },
        clearCategoryMessages: (state) => {
            state.success = false;
            state.message = null;
        },
    },
});

export const {
    categoryRequest,
    categorySuccess,
    categoryFail,
    categoryActionSuccess,
    clearCategoryErrors,
    clearCategoryMessages,
} = categorySlice.actions;

export default categorySlice.reducer;
