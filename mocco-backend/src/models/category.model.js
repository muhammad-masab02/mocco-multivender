import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        level: {
            type: Number,
            enum: [1, 2, 3], // 1: Main Category, 2: Subcategory, 3: Product Category
            required: true,
            default: 1,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        mainCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        path: {
            type: String,
            trim: true,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },
        icon: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure uniqueness within the same parent
categorySchema.index({ name: 1, parentId: 1 }, { unique: true });
categorySchema.index({ level: 1, isActive: 1 });
categorySchema.index({ slug: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
