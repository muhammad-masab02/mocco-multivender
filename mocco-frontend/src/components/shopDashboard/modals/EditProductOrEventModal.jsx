import { useState, useRef, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../../services/store/actions/product";
import { updateEvent } from "../../../services/store/actions/event";

const categories = [
  "Computers and Laptops",
  "Mobile and Tablets",
  "Music and Gaming",
  "Others",
];

const EditProductOrEventModal = ({ item, mode = "product", onClose, onSuccess }) => {
  const isEvent = mode === "event";
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    category: item?.category || categories[0],
    tags: Array.isArray(item?.tags) ? item.tags.join(", ") : item?.tags || "",
    price: item?.price ?? "",
    discount_price: item?.discount_price ?? "",
    stock: item?.stock ?? "",
    startDate: item?.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "",
    endDate: item?.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "",
    status: item?.status || "Running",
    isFeatured: !!item?.isFeatured,
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages] = useState(item?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [newImages]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));
    setNewImages((prev) => [...prev, ...mapped]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (isEvent && (!formData.startDate || !formData.endDate)) {
      setError("Start and end dates are required for events");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("tags", formData.tags);
      data.append("price", formData.price);
      data.append("discount_price", formData.discount_price);
      data.append("stock", formData.stock);

      if (isEvent) {
        data.append("startDate", formData.startDate);
        data.append("endDate", formData.endDate);
        data.append("status", formData.status);
      } else {
        data.append("isFeatured", formData.isFeatured);
      }

      newImages.forEach((img) => {
        data.append("files", img.file);
      });

      if (isEvent) {
        await dispatch(updateEvent(item._id, data));
      } else {
        await dispatch(updateProduct(item._id, data));
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900">
          Edit {isEvent ? "Event" : "Product"}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Update the details below. Leaving image uploads empty will retain existing images.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Description *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tech, gadget, mobile"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Original Price ($) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="any"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Discount Price ($)</label>
              <input
                type="number"
                name="discount_price"
                min="0"
                step="any"
                value={formData.discount_price}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Stock Units *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
          </div>

          {isEvent && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500"
                >
                  <option value="Running">Running</option>
                  <option value="Paused">Paused</option>
                  <option value="Ended">Ended</option>
                </select>
              </div>
            </div>
          )}

          {!isEvent && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editIsFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="editIsFeatured" className="text-xs font-medium text-slate-700 cursor-pointer">
                Mark this product as Featured
              </label>
            </div>
          )}

          {/* Existing & New Images */}
          <div className="space-y-2 pt-2">
            <span className="block text-xs font-semibold text-slate-700">
              Product Images (Upload new images to replace existing)
            </span>

            {existingImages.length > 0 && newImages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {existingImages.map((img, i) => (
                  <img
                    key={i}
                    src={img?.url || img}
                    alt="existing"
                    className="h-16 w-16 rounded-lg object-cover border border-slate-200"
                  />
                ))}
              </div>
            )}

            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {newImages.map((img, i) => (
                  <div key={i} className="relative h-16 w-16">
                    <img
                      src={img.previewUrl}
                      alt="new-upload"
                      className="h-16 w-16 rounded-lg object-cover border border-sky-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      className="absolute -top-1.5 -right-1.5 rounded-full bg-rose-500 p-0.5 text-white shadow-sm hover:bg-rose-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Upload size={14} />
              Choose New Images
            </button>
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductOrEventModal;
