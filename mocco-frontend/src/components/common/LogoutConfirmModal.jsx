import { useEffect } from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";

/**
 * Reusable confirmation modal for user/seller/admin logout.
 * Replaces native window.confirm with a modern, branded UI dialog.
 */
const LogoutConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Log Out of Your Account?",
  subtitle = "Are you sure you want to end your current session? You will need to sign in again to access your account.",
  confirmText = "Yes, Log Out",
  cancelText = "Stay Signed In",
}) => {
  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50 mb-5">
          <LogOut className="h-8 w-8 translate-x-0.5" />
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
          {subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer order-2 sm:order-1"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-sm font-bold text-white shadow-lg shadow-red-600/25 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
