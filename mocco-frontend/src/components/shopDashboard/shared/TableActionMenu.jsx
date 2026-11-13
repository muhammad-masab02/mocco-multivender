import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, ExternalLink, Star } from "lucide-react";

/**
 * TableActionMenu
 * Unified dropdown action menu for dashboard tables (Products, Events, Coupons).
 *
 * Props:
 * - actions: Array of action objects:
 *   {
 *      label: string,
 *      icon: "edit" | "delete" | "preview" | "feature",
 *      onClick: () => void,
 *      variant?: "default" | "danger" | "success" | "warning",
 *      active?: boolean, // for toggle icons like feature
 *   }
 */
const TableActionMenu = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (action) => {
    const size = 16;
    switch (action.icon) {
      case "edit":
        return <Edit2 size={size} className="text-slate-500 group-hover:text-sky-600" />;
      case "delete":
        return <Trash2 size={size} className="text-rose-500 group-hover:text-rose-600" />;
      case "preview":
        return <ExternalLink size={size} className="text-slate-500 group-hover:text-sky-600" />;
      case "feature":
        return (
          <Star
            size={size}
            className={action.active ? "text-amber-500 fill-amber-500" : "text-slate-400"}
          />
        );
      default:
        return null;
    }
  };

  const getTextColor = (action) => {
    if (action.variant === "danger") return "text-rose-600 hover:bg-rose-50";
    if (action.variant === "warning" || action.active) return "text-amber-600 hover:bg-amber-50";
    return "text-slate-700 hover:bg-slate-50 hover:text-sky-600";
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
        aria-label="Actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-30 mt-1.5 w-44 origin-top-right rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-200/50 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          {actions.map((act, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                act.onClick?.();
              }}
              className={`group flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition ${getTextColor(
                act
              )}`}
              role="menuitem"
            >
              {getIcon(act)}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableActionMenu;
