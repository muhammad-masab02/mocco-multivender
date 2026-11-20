import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Edit2, Trash2, ExternalLink, Star } from "lucide-react";

/**
 * TableActionMenu
 * Unified dropdown action menu for dashboard tables (Products, Events, Coupons).
 * Uses React Portal to render the dropdown outside overflow containers, preventing
 * clipping by table scrolling / card borders.
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
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0, openUpward: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const calculateCoords = useCallback(() => {
    if (!buttonRef.current) return null;
    const btnRect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 176; // w-44 = 176px
    const estimatedHeight = Math.max(120, actions.length * 36 + 16);
    const spaceBelow = window.innerHeight - btnRect.bottom;
    const openUpward = spaceBelow < estimatedHeight + 12 && btnRect.top > estimatedHeight;

    let left = btnRect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    const top = openUpward
      ? Math.max(10, btnRect.top - estimatedHeight - 4)
      : Math.min(window.innerHeight - estimatedHeight - 10, btnRect.bottom + 4);

    return { top, left, openUpward };
  }, [actions.length]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      const coords = calculateCoords();
      if (coords) setMenuCoords(coords);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Fine-tune position using the actual rendered menu dimensions once open
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const menuWidth = menuRect.width || 176;
      const menuHeight = menuRect.height || 130;
      const spaceBelow = window.innerHeight - btnRect.bottom;
      const openUpward = spaceBelow < menuHeight + 12 && btnRect.top > menuHeight;

      let left = btnRect.right - menuWidth;
      if (left < 10) left = 10;
      if (left + menuWidth > window.innerWidth - 10) {
        left = window.innerWidth - menuWidth - 10;
      }

      const top = openUpward
        ? Math.max(10, btnRect.top - menuHeight - 4)
        : Math.min(window.innerHeight - menuHeight - 10, btnRect.bottom + 4);

      setMenuCoords({ top, left, openUpward });
    }
  }, [isOpen]);

  // Close when clicking outside, scrolling, or resizing
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
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
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-100 ${
          isOpen
            ? "border-sky-300 bg-sky-50 text-sky-600 ring-2 ring-sky-100"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
        }`}
        aria-label="Actions"
        aria-expanded={isOpen}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuCoords.top}px`,
              left: `${menuCoords.left}px`,
            }}
            className="z-50 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
            role="menu"
            onClick={(e) => e.stopPropagation()}
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
                className={`group flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition cursor-pointer ${getTextColor(
                  act
                )}`}
                role="menuitem"
              >
                {getIcon(act)}
                <span>{act.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default TableActionMenu;
