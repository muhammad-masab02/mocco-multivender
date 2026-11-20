import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import Event from "../models/event.model.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { DEFAULT_CATEGORY_TREE, slugify } from "../utils/defaultCategories.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * Seeds default 3-level category hierarchy if collection is empty or upon admin request.
 */
export const seedCategoriesInternal = async (force = false) => {
    try {
        const count = await Category.countDocuments();
        if (count > 0 && !force) {
            return { seeded: false, count };
        }

        if (force) {
            await Category.deleteMany({});
        }

        let mainOrder = 0;
        let totalCreated = 0;

        for (const main of DEFAULT_CATEGORY_TREE) {
            mainOrder += 10;
            const mainSlug = slugify(main.name);

            const mainDoc = await Category.create({
                name: main.name,
                slug: mainSlug,
                level: 1,
                parentId: null,
                mainCategoryId: null,
                path: main.name,
                description: main.description || "",
                icon: main.icon || "Folder",
                image: main.image || { url: "", public_id: "" },
                isActive: true,
                displayOrder: mainOrder,
            });
            totalCreated++;

            let subOrder = 0;
            for (const sub of main.subcategories || []) {
                subOrder += 10;
                const subSlug = `${mainSlug}-${slugify(sub.name)}`;
                const subPath = `${main.name} > ${sub.name}`;

                const subDoc = await Category.create({
                    name: sub.name,
                    slug: subSlug,
                    level: 2,
                    parentId: mainDoc._id,
                    mainCategoryId: mainDoc._id,
                    path: subPath,
                    description: `${sub.name} in ${main.name}`,
                    icon: "ChevronRight",
                    isActive: true,
                    displayOrder: subOrder,
                });
                totalCreated++;

                let itemOrder = 0;
                for (const catName of sub.categories || []) {
                    itemOrder += 10;
                    const catSlug = `${subSlug}-${slugify(catName)}`;
                    const catPath = `${main.name} > ${sub.name} > ${catName}`;

                    await Category.create({
                        name: catName,
                        slug: catSlug,
                        level: 3,
                        parentId: subDoc._id,
                        mainCategoryId: mainDoc._id,
                        path: catPath,
                        description: `${catName} under ${sub.name}`,
                        icon: "Tag",
                        isActive: true,
                        displayOrder: itemOrder,
                    });
                    totalCreated++;
                }
            }
        }

        return { seeded: true, totalCreated };
    } catch (error) {
        console.error("Error in seedCategoriesInternal:", error);
        throw error;
    }
};

/**
 * 1. Get complete category hierarchy tree (Main -> Sub -> Product Categories)
 * Query: ?all=true to include inactive (admin view)
 */
export const getCategoryTree = catchAsyncErrors(async (req, res, next) => {
    const includeAll = req.query.all === "true" || req.query.includeInactive === "true";

    // Auto-seed if empty
    const currentCount = await Category.countDocuments();
    if (currentCount === 0) {
        await seedCategoriesInternal(false);
    }

    const filter = includeAll ? {} : { isActive: true };
    const allCategories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();

    // Group by level
    const level1 = [];
    const level2Map = new Map(); // parentId -> [subcategories]
    const level3Map = new Map(); // parentId -> [categories]

    let totalMain = 0;
    let totalSub = 0;
    let totalProductCategories = 0;
    let totalActive = 0;

    for (const cat of allCategories) {
        if (cat.isActive) totalActive++;

        if (cat.level === 1) {
            totalMain++;
            level1.push(cat);
        } else if (cat.level === 2) {
            totalSub++;
            const pId = cat.parentId ? cat.parentId.toString() : "root";
            if (!level2Map.has(pId)) level2Map.set(pId, []);
            level2Map.get(pId).push(cat);
        } else if (cat.level === 3) {
            totalProductCategories++;
            const pId = cat.parentId ? cat.parentId.toString() : "root";
            if (!level3Map.has(pId)) level3Map.set(pId, []);
            level3Map.get(pId).push(cat);
        }
    }

    // Assemble nested tree with full dual-compatibility (both .children and .subcategories/.categories)
    const tree = level1.map((main) => {
        const mainId = main._id.toString();
        const subcategories = (level2Map.get(mainId) || []).map((sub) => {
            const subId = sub._id.toString();
            const categories = (level3Map.get(subId) || []).map((cat) => ({
                ...cat,
                children: [],
            }));
            return {
                ...sub,
                categories,
                subcategories: categories,
                children: categories,
                itemCount: categories.length,
            };
        });

        return {
            ...main,
            subcategories,
            categories: subcategories,
            children: subcategories,
            subcategoryCount: subcategories.length,
            totalLeafCategories: subcategories.reduce((acc, s) => acc + (s.categories?.length || 0), 0),
        };
    });

    res.status(200).json({
        success: true,
        tree,
        stats: {
            totalCategories: allCategories.length,
            totalMain,
            totalSub,
            totalProductCategories,
            totalActive,
        },
    });
});

/**
 * 2. Get flat list of categories with optional level or parentId filter
 */
export const getFlatCategories = catchAsyncErrors(async (req, res, next) => {
    const { level, parentId, isActive, search } = req.query;
    const query = {};

    if (level) query.level = Number(level);
    if (parentId) query.parentId = parentId;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search && search.trim()) {
        query.name = { $regex: search.trim(), $options: "i" };
    }

    const categories = await Category.find(query).sort({ level: 1, displayOrder: 1, name: 1 });
    res.status(200).json({ success: true, categories });
});

/**
 * 3. Create a Category (Admin only)
 */
export const createCategory = catchAsyncErrors(async (req, res, next) => {
    const { name, level = 1, parentId, description, icon, displayOrder = 0 } = req.body;

    if (!name || !name.trim()) {
        return next(new ErrorHandler("Category name is required", 400));
    }

    const parsedLevel = Number(level);
    if (![1, 2, 3].includes(parsedLevel)) {
        return next(new ErrorHandler("Invalid category level. Must be 1, 2, or 3", 400));
    }

    let parentCategory = null;
    let mainCategoryId = null;
    let computedPath = name.trim();
    let baseSlug = slugify(name);

    if (parsedLevel > 1) {
        if (!parentId) {
            return next(new ErrorHandler(`Parent category is required for level ${parsedLevel}`, 400));
        }

        parentCategory = await Category.findById(parentId);
        if (!parentCategory) {
            return next(new ErrorHandler("Parent category not found", 404));
        }

        if (parentCategory.level !== parsedLevel - 1) {
            return next(
                new ErrorHandler(
                    `Parent category level mismatch. Level ${parsedLevel} requires a Level ${parsedLevel - 1} parent.`,
                    400
                )
            );
        }

        computedPath = `${parentCategory.path} > ${name.trim()}`;
        baseSlug = `${parentCategory.slug}-${baseSlug}`;

        if (parsedLevel === 2) {
            mainCategoryId = parentCategory._id;
        } else if (parsedLevel === 3) {
            mainCategoryId = parentCategory.mainCategoryId || parentCategory.parentId;
        }
    }

    // Handle optional image upload
    let imageObj = { public_id: "", url: "" };
    if (req.file) {
        const uploadRes = await uploadToCloudinary(req.file, "mocco/categories");
        if (uploadRes) {
            imageObj = { public_id: uploadRes.public_id, url: uploadRes.url };
        }
    }

    // Check duplicate
    const existing = await Category.findOne({ name: name.trim(), parentId: parentId || null });
    if (existing) {
        return next(new ErrorHandler("A category with this name already exists under the selected parent", 400));
    }

    const category = await Category.create({
        name: name.trim(),
        slug: baseSlug,
        level: parsedLevel,
        parentId: parentId || null,
        mainCategoryId,
        path: computedPath,
        description: description || "",
        icon: icon || (parsedLevel === 1 ? "Folder" : parsedLevel === 2 ? "ChevronRight" : "Tag"),
        image: imageObj,
        isActive: true,
        displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
    });
});

/**
 * 4. Update Category (Admin only)
 */
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, icon, displayOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    const oldName = category.name;
    const nameChanged = name && name.trim() !== oldName;

    if (nameChanged) {
        category.name = name.trim();

        // Update path and slug
        if (category.level === 1) {
            category.slug = slugify(category.name);
            category.path = category.name;
        } else {
            const parent = await Category.findById(category.parentId);
            if (parent) {
                category.slug = `${parent.slug}-${slugify(category.name)}`;
                category.path = `${parent.path} > ${category.name}`;
            }
        }
    }

    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    // Image replacement
    if (req.file) {
        if (category.image?.public_id) {
            await deleteFromCloudinary(category.image.public_id);
        }
        const uploadRes = await uploadToCloudinary(req.file, "mocco/categories");
        if (uploadRes) {
            category.image = { public_id: uploadRes.public_id, url: uploadRes.url };
        }
    }

    await category.save();

    // If name changed, cascade path and slug updates to children
    if (nameChanged) {
        const updateChildren = async (parentId, parentPath, parentSlug) => {
            const children = await Category.find({ parentId });
            for (const child of children) {
                child.path = `${parentPath} > ${child.name}`;
                child.slug = `${parentSlug}-${slugify(child.name)}`;
                await child.save();
                await updateChildren(child._id, child.path, child.slug);
            }
        };
        await updateChildren(category._id, category.path, category.slug);
    }

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
    });
});

/**
 * 5. Toggle Category Status (Active/Inactive) (Admin only)
 */
export const toggleCategoryStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    const newStatus = !category.isActive;
    category.isActive = newStatus;
    await category.save();

    // If deactivating, cascade deactivation to all children
    if (!newStatus) {
        const deactivateChildren = async (parentId) => {
            const children = await Category.find({ parentId });
            for (const child of children) {
                child.isActive = false;
                await child.save();
                await deactivateChildren(child._id);
            }
        };
        await deactivateChildren(category._id);
    } else {
        // If activating, ensure parent chain is also active
        let currentParentId = category.parentId;
        while (currentParentId) {
            const parent = await Category.findById(currentParentId);
            if (parent && !parent.isActive) {
                parent.isActive = true;
                await parent.save();
                currentParentId = parent.parentId;
            } else {
                break;
            }
        }
    }

    res.status(200).json({
        success: true,
        message: `Category ${newStatus ? "activated" : "deactivated"} successfully`,
        isActive: newStatus,
    });
});

/**
 * 6. Delete Category (Admin only)
 */
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    // Check if products or events are associated with this category
    const categoryName = category.name;
    const [productCount, eventCount] = await Promise.all([
        Product.countDocuments({
            $or: [
                { category: categoryName },
                { subCategory: categoryName },
                { mainCategory: categoryName },
            ],
        }),
        Event.countDocuments({
            $or: [
                { category: categoryName },
                { subCategory: categoryName },
                { mainCategory: categoryName },
            ],
        }),
    ]);

    if (productCount > 0 || eventCount > 0) {
        return next(
            new ErrorHandler(
                `Cannot delete category "${categoryName}". It is currently linked to ${productCount} product(s) and ${eventCount} event(s). Deactivate it instead or reassign the items first.`,
                400
            )
        );
    }

    // Collect all child IDs to delete recursively
    const idsToDelete = [category._id];
    const collectChildIds = async (parentId) => {
        const children = await Category.find({ parentId }).select("_id image");
        for (const child of children) {
            idsToDelete.push(child._id);
            if (child.image?.public_id) {
                await deleteFromCloudinary(child.image.public_id).catch(() => {});
            }
            await collectChildIds(child._id);
        }
    };
    await collectChildIds(category._id);

    if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id).catch(() => {});
    }

    await Category.deleteMany({ _id: { $in: idsToDelete } });

    res.status(200).json({
        success: true,
        message: `Deleted category and ${idsToDelete.length - 1} nested sub-items successfully`,
    });
});

/**
 * 7. Admin Reset / Seed Default Hierarchy
 */
export const resetDefaultCategories = catchAsyncErrors(async (req, res, next) => {
    const result = await seedCategoriesInternal(true);
    res.status(200).json({
        success: true,
        message: `Category structure initialized successfully with ${result.totalCreated} items across 3 levels.`,
        result,
    });
});
