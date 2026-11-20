import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FolderTree,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Layers,
  Tag,
  Folder,
  Eye,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import {
  getCategoryTree,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  resetDefaultCategories,
} from "../../../services/store/actions/category";

const AdminCategoriesTab = () => {
  const dispatch = useDispatch();
  const { categoriesTree, stats, isLoading } = useSelector(
    (state) => state.category
  );

  const [expandedMains, setExpandedMains] = useState({});
  const [expandedSubs, setExpandedSubs] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"

  // Modal states
  const [modalMode, setModalMode] = useState(null); // "add" | "edit"
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalForm, setModalForm] = useState({
    name: "",
    level: 1,
    parentId: "",
    mainCategoryId: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all categories (include inactive for admin)
  useEffect(() => {
    dispatch(getCategoryTree(true));
  }, [dispatch]);

  // Expand all by default once data arrives
  useEffect(() => {
    if (categoriesTree && categoriesTree.length > 0) {
      const mainExp = {};
      const subExp = {};
      categoriesTree.forEach((m) => {
        mainExp[m._id] = true;
        m.subcategories?.forEach((s) => {
          subExp[s._id] = true;
        });
      });
      setExpandedMains(mainExp);
      setExpandedSubs(subExp);
    }
  }, [categoriesTree?.length]);

  const toggleMainExpand = (mainId) => {
    setExpandedMains((prev) => ({ ...prev, [mainId]: !prev[mainId] }));
  };

  const toggleSubExpand = (subId) => {
    setExpandedSubs((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  // Filtered tree based on search and status
  const filteredTree = useMemo(() => {
    if (!categoriesTree || !Array.isArray(categoriesTree)) return [];
    const query = searchQuery.trim().toLowerCase();

    return categoriesTree
      .map((main) => {
        const mainMatches =
          !query ||
          main.name.toLowerCase().includes(query) ||
          main.path?.toLowerCase().includes(query);

        const filteredSubs = (main.subcategories || [])
          .map((sub) => {
            const subMatches =
              !query ||
              sub.name.toLowerCase().includes(query) ||
              sub.path?.toLowerCase().includes(query);

            const filteredCategories = (sub.categories || []).filter((cat) => {
              const catMatches =
                !query ||
                cat.name.toLowerCase().includes(query) ||
                cat.path?.toLowerCase().includes(query);

              if (statusFilter === "active") return catMatches && cat.isActive;
              if (statusFilter === "inactive") return catMatches && !cat.isActive;
              return catMatches;
            });

            const keepSub =
              (statusFilter === "active" ? sub.isActive : statusFilter === "inactive" ? !sub.isActive : true) &&
              (subMatches || filteredCategories.length > 0 || mainMatches);

            return keepSub
              ? {
                  ...sub,
                  categories: filteredCategories,
                }
              : null;
          })
          .filter(Boolean);

        const keepMain =
          (statusFilter === "active" ? main.isActive : statusFilter === "inactive" ? !main.isActive : true) &&
          (mainMatches || filteredSubs.length > 0);

        return keepMain
          ? {
              ...main,
              subcategories: filteredSubs,
            }
          : null;
      })
      .filter(Boolean);
  }, [categoriesTree, searchQuery, statusFilter]);

  // Open Add modal with smart presets
  const handleOpenAddModal = (presetLevel = 1, presetParentId = "", presetMainId = "") => {
    setModalMode("add");
    setEditingCategory(null);
    setModalForm({
      name: "",
      level: presetLevel,
      parentId: presetParentId,
      mainCategoryId: presetMainId,
      description: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  // Open Edit modal
  const handleOpenEditModal = (category) => {
    setModalMode("edit");
    setEditingCategory(category);
    setModalForm({
      name: category.name || "",
      level: category.level || 1,
      parentId: category.parentId || "",
      mainCategoryId: category.mainCategoryId || "",
      description: category.description || "",
      displayOrder: category.displayOrder || 0,
      isActive: category.isActive ?? true,
    });
  };

  // Status toggle handler
  const handleToggleStatus = async (category) => {
    try {
      await dispatch(toggleCategoryStatus(category._id));
      toast.success(
        `Category "${category.name}" ${
          category.isActive ? "deactivated" : "activated"
        } successfully`
      );
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    }
  };

  // Submit Add or Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (modalMode === "add") {
        await dispatch(createCategory(modalForm));
        toast.success(`Category "${modalForm.name}" created successfully!`);
      } else if (modalMode === "edit" && editingCategory) {
        await dispatch(updateCategory(editingCategory._id, modalForm));
        toast.success(`Category "${modalForm.name}" updated successfully!`);
      }
      setModalMode(null);
      setEditingCategory(null);
    } catch (err) {
      toast.error(err?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteCategory(deletingCategory._id));
      toast.success(`Category "${deletingCategory.name}" deleted successfully!`);
      setDeletingCategory(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset to default seed
  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to re-seed the category hierarchy? This will restore the 6 main categories and their official sub-items."
      )
    ) {
      return;
    }
    try {
      await dispatch(resetDefaultCategories());
      toast.success("Default 3-level categories initialized successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to reset categories");
    }
  };

  // Main Categories for dropdown selectors
  const mainCategoriesList = useMemo(() => {
    return (categoriesTree || []).filter((c) => c.level === 1);
  }, [categoriesTree]);

  // Subcategories for dropdown selectors based on selected main category
  const subCategoriesList = useMemo(() => {
    if (!modalForm.mainCategoryId) {
      // Find matching main by parentId if level 2
      const foundMain = (categoriesTree || []).find(
        (m) => m._id === modalForm.parentId
      );
      return foundMain?.subcategories || [];
    }
    const foundMain = (categoriesTree || []).find(
      (m) => m._id === modalForm.mainCategoryId
    );
    return foundMain?.subcategories || [];
  }, [categoriesTree, modalForm.mainCategoryId, modalForm.parentId]);

  return (
    <div className="space-y-6">
      {/* ── Top Header & Stats ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <FolderTree className="h-7 w-7 text-teal-600" />
            <span>Category Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the official 3-level hierarchy: Main Category → Subcategory → Product Category.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Re-seed standard 3-level categories"
          >
            <RefreshCw size={14} className="text-slate-500" />
            <span>Sync Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal(1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Main Category</span>
          </button>
        </div>
      </div>

      {/* ── Stats Cards Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Main (L1)
            </span>
            <span className="h-8 w-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Folder size={16} />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.totalMain || 0}
          </p>
          <span className="text-[11px] text-slate-400">Core departments</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Subcategories (L2)
            </span>
            <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers size={16} />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.totalSub || 0}
          </p>
          <span className="text-[11px] text-slate-400">Mid-level groupings</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Product Items (L3)
            </span>
            <span className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag size={16} />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {stats?.totalProductCategories || 0}
          </p>
          <span className="text-[11px] text-slate-400">Product categories</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Items
            </span>
            <span className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {stats?.totalActive || 0}
          </p>
          <span className="text-[11px] text-slate-400">Live on storefront</span>
        </div>
      </div>

      {/* ── Filter & Search Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories across all levels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {["all", "active", "inactive"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === st
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3-Level Category Tree Visualizer ─────────────────────────── */}
      {isLoading && (!categoriesTree || categoriesTree.length === 0) ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredTree.length > 0 ? (
        <div className="space-y-4">
          {filteredTree.map((main) => {
            const isMainExpanded = Boolean(expandedMains[main._id]);
            const totalLeafs =
              main.totalLeafCategories ??
              (main.subcategories || []).reduce(
                (acc, s) => acc + (s.categories?.length || 0),
                0
              );

            return (
              <div
                key={main._id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                  !main.isActive
                    ? "border-slate-200/80 opacity-70 bg-slate-50/50"
                    : "border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                {/* ── Level 1: Main Category Header ────────────────────── */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-linear-to-r from-slate-50/80 to-white border-b border-slate-100">
                  <div
                    onClick={() => toggleMainExpand(main._id)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer select-none flex-1"
                  >
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                      aria-label="Toggle Expand"
                    >
                      {isMainExpanded ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>

                    <div className="h-10 w-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-700 font-bold">
                      <Folder size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                          {main.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-wider">
                          Level 1 • Main
                        </span>
                        {!main.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {main.subcategories?.length || 0} subcategories •{" "}
                        {totalLeafs} product categories
                      </p>
                    </div>
                  </div>

                  {/* Level 1 Action Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(main)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        main.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                      title={main.isActive ? "Deactivate main category" : "Activate main category"}
                    >
                      {main.isActive ? "Active" : "Inactive"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(2, main._id, main._id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold transition cursor-pointer"
                      title="Add subcategory under this main category"
                    >
                      <Plus size={13} />
                      <span className="hidden sm:inline">Add Subcategory</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(main)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                      title="Edit main category"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCategory(main)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete main category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* ── Level 2 & 3: Body Accordion ───────────────────────── */}
                {isMainExpanded && (
                  <div className="p-4 sm:p-6 space-y-4 bg-slate-50/40">
                    {main.subcategories?.length > 0 ? (
                      main.subcategories.map((sub) => {
                        const isSubExpanded = Boolean(expandedSubs[sub._id]);
                        const subCategoriesCount = sub.categories?.length || 0;

                        return (
                          <div
                            key={sub._id}
                            className={`rounded-xl border bg-white transition ${
                              !sub.isActive
                                ? "border-slate-200/80 opacity-70"
                                : "border-slate-200 shadow-2xs"
                            }`}
                          >
                            {/* Subcategory Row */}
                            <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-slate-100">
                              <div
                                onClick={() => toggleSubExpand(sub._id)}
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none flex-1"
                              >
                                <button
                                  type="button"
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
                                >
                                  {isSubExpanded ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                </button>

                                <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">
                                  <Layers size={14} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                                      {sub.name}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                      L2 • Subcategory
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                      ({subCategoriesCount} items)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Subcategory Controls */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(sub)}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                                    sub.isActive
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  {sub.isActive ? "Active" : "Inactive"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenAddModal(3, sub._id, main._id)
                                  }
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition cursor-pointer"
                                  title="Add product category under this subcategory"
                                >
                                  <Plus size={12} />
                                  <span className="hidden sm:inline">Add Item</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(sub)}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition cursor-pointer"
                                >
                                  <Edit2 size={14} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setDeletingCategory(sub)}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {/* ── Level 3: Product Category Tags List ───── */}
                            {isSubExpanded && (
                              <div className="p-3 sm:p-4 bg-slate-50/50">
                                {sub.categories?.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {sub.categories.map((item) => (
                                      <div
                                        key={item._id}
                                        className={`group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border text-xs transition-all ${
                                          item.isActive
                                            ? "bg-white border-slate-200/90 text-slate-700 shadow-2xs hover:border-purple-300 hover:shadow-xs"
                                            : "bg-slate-100 border-slate-200 text-slate-400 opacity-60"
                                        }`}
                                      >
                                        <Tag size={11} className="text-purple-500 shrink-0" />
                                        <span className="font-semibold">{item.name}</span>

                                        <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-slate-200">
                                          <button
                                            type="button"
                                            onClick={() => handleToggleStatus(item)}
                                            className={`h-2 w-2 rounded-full cursor-pointer transition ${
                                              item.isActive
                                                ? "bg-emerald-500"
                                                : "bg-slate-300"
                                            }`}
                                            title={item.isActive ? "Deactivate" : "Activate"}
                                          />

                                          <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                            title="Edit"
                                          >
                                            <Edit2 size={11} />
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => setDeletingCategory(item)}
                                            className="p-0.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                            title="Delete"
                                          >
                                            <X size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenAddModal(3, sub._id, main._id)
                                      }
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-purple-400 text-slate-500 hover:text-purple-700 text-xs font-semibold transition cursor-pointer"
                                    >
                                      <Plus size={12} />
                                      <span>Add Product Category</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="py-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                    <span>No product categories added yet.</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenAddModal(3, sub._id, main._id)
                                      }
                                      className="text-purple-600 font-bold hover:underline"
                                    >
                                      + Add first item
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                        <p>No subcategories added under {main.name}.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal(2, main._id, main._id)}
                          className="mt-2 inline-flex items-center gap-1 text-teal-600 font-bold hover:underline text-xs"
                        >
                          <Plus size={13} />
                          <span>Add Subcategory</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <FolderTree className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            No matching categories found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery
              ? `No categories match "${searchQuery}". Try a different keyword.`
              : "No categories in database. Click below to initialize the standard categories."}
          </p>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Clear Search
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20"
            >
              Sync Default 3-Level Categories
            </button>
          )}
        </div>
      )}

      {/* ── Modal: Add / Edit Category ────────────────────────────────── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl shadow-slate-900/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {modalMode === "add" ? "Create Category" : "Edit Category"}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
              {/* Level Selector (Disabled in edit mode to preserve hierarchy) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Category Level *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { lvl: 1, label: "Main (L1)" },
                    { lvl: 2, label: "Subcategory (L2)" },
                    { lvl: 3, label: "Product (L3)" },
                  ].map((item) => (
                    <button
                      key={item.lvl}
                      type="button"
                      disabled={modalMode === "edit"}
                      onClick={() =>
                        setModalForm((prev) => ({
                          ...prev,
                          level: item.lvl,
                          parentId: "",
                          mainCategoryId: "",
                        }))
                      }
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        modalForm.level === item.lvl
                          ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 disabled:opacity-60"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Selector for Level 2 */}
              {modalForm.level === 2 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Parent Main Category *
                  </label>
                  <select
                    value={modalForm.parentId}
                    onChange={(e) =>
                      setModalForm((prev) => ({
                        ...prev,
                        parentId: e.target.value,
                        mainCategoryId: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                    required
                  >
                    <option value="" disabled>
                      Choose Main Category
                    </option>
                    {mainCategoriesList.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cascading Selector for Level 3 */}
              {modalForm.level === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Select Main Category *
                    </label>
                    <select
                      value={modalForm.mainCategoryId}
                      onChange={(e) =>
                        setModalForm((prev) => ({
                          ...prev,
                          mainCategoryId: e.target.value,
                          parentId: "", // Reset subcategory when main changes
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                      required
                    >
                      <option value="" disabled>
                        Choose Main Category
                      </option>
                      {mainCategoriesList.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2. Select Parent Subcategory *
                    </label>
                    <select
                      value={modalForm.parentId}
                      onChange={(e) =>
                        setModalForm((prev) => ({
                          ...prev,
                          parentId: e.target.value,
                        }))
                      }
                      disabled={!modalForm.mainCategoryId}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500 disabled:bg-slate-100 disabled:text-slate-400"
                      required
                    >
                      <option value="" disabled>
                        {modalForm.mainCategoryId
                          ? "Choose Subcategory"
                          : "Select Main Category First"}
                      </option>
                      {subCategoriesList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smartphones, Women's Fashion, Cookware"
                  value={modalForm.name}
                  onChange={(e) =>
                    setModalForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description for this category..."
                  value={modalForm.description}
                  onChange={(e) =>
                    setModalForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={modalForm.displayOrder}
                  onChange={(e) =>
                    setModalForm((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "add"
                    ? "Create Category"
                    : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Confirmation ────────────────────────────────── */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Category?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-800">
                  "{deletingCategory.name}"
                </span>
                ? Any nested sub-items will also be removed. This action cannot be
                undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 disabled:opacity-60 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesTab;
