import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateCoupon } from "../../../services/store/actions/coupon";
import { categoriesData } from "../../../static/data";

const EditCouponModal = ({ coupon, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const { categoriesTree } = useSelector((state) => state.category || {});

  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discount: coupon?.value ?? "",
    minAmount: coupon?.minAmount ?? "",
    maxAmount: coupon?.maxAmount ?? "",
    productId: coupon?.product?._id || coupon?.product || "",
    categoryId: coupon?.category || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "discount" || name === "minAmount" || name === "maxAmount"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.code.trim()) {
      setError("Coupon code is required");
      return;
    }
    if (formData.discount === "" || formData.discount == null) {
      setError("Discount percentage is required");
      return;
    }
    if (formData.minAmount && formData.maxAmount && Number(formData.minAmount) > Number(formData.maxAmount)) {
      setError("Min amount cannot be greater than max amount");
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateCoupon(coupon._id, formData));
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900">Edit Coupon</h3>
        <p className="mt-1 text-xs text-slate-500">
          Modify coupon rules, discount value, or applicable product/category.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Coupon Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SUMMER25"
              className="mt-1 w-full uppercase rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Min Order ($)</label>
              <input
                type="number"
                name="minAmount"
                min="0"
                value={formData.minAmount}
                onChange={handleChange}
                placeholder="100"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Max Order ($)</label>
              <input
                type="number"
                name="maxAmount"
                min="0"
                value={formData.maxAmount}
                onChange={handleChange}
                placeholder="500"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="">Select Category</option>
                {(categoriesTree?.length ? categoriesTree : categoriesData.map(c => ({ name: c.title, children: [] }))).map((main) => (
                  <optgroup key={main._id || main.name} label={main.name}>
                    <option value={main.name}>{main.name} (All)</option>
                    {(main.children || main.subcategories)?.map((sub) => (
                      <option key={sub._id || sub.name} value={sub.name}>
                        -- {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Applicable Product</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="">All Products</option>
                {products?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Discount Value (%) *</label>
            <input
              type="number"
              name="discount"
              min="1"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              placeholder="20"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition disabled:bg-sky-400"
            >
              {loading ? "Updating..." : "Save Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponModal;
