import { useState } from "react";
import { Star, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addProductReview } from "../../services/store/actions/product";
import toast from "react-hot-toast";

const WriteReviewModal = ({
  item,
  orderId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const itemName = item?.name || item?.productId?.name || "Product";
  const itemImage =
    item?.images?.[0]?.url ||
    item?.productId?.images?.[0]?.url ||
    item?.image ||
    null;
  const targetId = item?.productId?._id || item?.productId || item?._id || item?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating star (1-5).");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await dispatch(
        addProductReview({
          productId: targetId,
          orderId: orderId || null,
          rating,
          comment: comment.trim(),
        })
      );

      toast.success(res?.message || "Review submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-slate-900">Write a Review</h3>
        <p className="mt-1 text-xs text-slate-500">
          Share your experience with this item to help other shoppers and the seller.
        </p>

        {/* Product snippet */}
        <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {itemImage ? (
              <img src={itemImage} alt={itemName} className="h-full w-full object-cover" />
            ) : (
              <Star className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 line-clamp-1">{itemName}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Rating stars */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={28}
                      className={active ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-bold text-slate-700">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Review Comment
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How was the quality, delivery, and seller service?"
              className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition disabled:bg-slate-400 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
