import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarClock,
  Hash,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  PencilLine,
  Phone,
  Star,
  Store,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { formatJoinedDate, toTitle } from "./utils";
import { createConversation } from "../../services/store/actions/conversation";

const InfoRow = ({ icon: IconComponent, label, value }) => {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
        <IconComponent className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-slate-800 break-words mt-0.5">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

const MyShopSidebar = ({
  displayShop,
  totalProducts = 0,
  sellerCreatedAt,
  onEditClick,
  onLogout,
  isOwner = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { seller: currentSeller } = useSelector((state) => state.seller);

  const handleSendMessage = async () => {
    if (!user?._id) {
      toast.error("Please login to send message!");
      navigate("/login");
      return;
    }

    if (!displayShop?._id) {
      toast.error("Shop information is unavailable.");
      return;
    }

    toast.loading("Opening conversation...", { id: "conv-toast" });

    const res = await dispatch(
      createConversation({
        userId: user._id,
        sellerId: displayShop._id,
        groupTitle: `Shop_${displayShop._id}`,
      }),
    );

    if (res?.success && res?.conversation) {
      toast.success("Conversation opened!", { id: "conv-toast" });
      if (currentSeller?._id) {
        navigate(
          `/shop-dashboard/?tab=inbox&conversationId=${res.conversation._id}`,
        );
      } else {
        navigate(
          `/my-profile?tab=inbox&conversationId=${res.conversation._id}`,
        );
      }
    } else {
      toast.error(res?.message || "Failed to create conversation.", {
        id: "conv-toast",
      });
    }
  };

  const ratingVal = Number(displayShop.ratings || 0);

  return (
    <aside className="w-full rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-6">
      {/* Shop Avatar & Name Card */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={displayShop.avatarUrl}
            alt={displayShop.name || "Shop avatar"}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-slate-100"
          />
          <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs" title="Verified Seller">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>

        <h2 className="mt-4 text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          {toTitle(displayShop.name)}
        </h2>

        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{ratingVal > 0 ? ratingVal.toFixed(1) : "New Seller"}</span>
          {ratingVal > 0 && <span className="text-slate-400 font-normal">/ 5.0</span>}
        </div>

        {displayShop.description && (
          <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-xs text-center line-clamp-3">
            {displayShop.description}
          </p>
        )}
      </div>

      {/* Info Rows */}
      <div className="border-t border-slate-100 pt-4">
        {displayShop.email ? (
          <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </p>
              <a
                href={`mailto:${displayShop.email}`}
                className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors break-all mt-0.5 inline-block"
              >
                {displayShop.email}
              </a>
            </div>
          </div>
        ) : null}
        {displayShop.addresses && (
          <InfoRow icon={MapPin} label="Location" value={displayShop.addresses} />
        )}
        {isOwner && displayShop.phoneNumber && (
          <InfoRow
            icon={Phone}
            label="Phone"
            value={displayShop.phoneNumber}
          />
        )}
        {isOwner && displayShop.zipCode && (
          <InfoRow icon={Hash} label="Zip Code" value={displayShop.zipCode} />
        )}
        <InfoRow
          icon={Package}
          label="Total Products"
          value={String(totalProducts)}
        />
        <InfoRow
          icon={CalendarClock}
          label="Member Since"
          value={formatJoinedDate(sellerCreatedAt)}
        />
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        {isOwner ? (
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={onEditClick}
              className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition shadow-xs"
            >
              <PencilLine className="w-4 h-4 text-slate-500" />
              <span>Edit Store Info</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 text-xs sm:text-sm font-bold text-red-600 transition"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Seller Logout</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] px-4 py-3 text-xs sm:text-sm font-bold text-white transition shadow-md shadow-slate-900/20"
          >
            <MessageSquare className="w-4 h-4 text-red-400" />
            <span>Message Seller</span>
          </button>
        )}
      </div>

      {/* Trust Badge */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Verified Mocco Mart Merchant</span>
      </div>
    </aside>
  );
};

export default MyShopSidebar;
