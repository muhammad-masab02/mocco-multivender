import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWithdrawRequests,
  updateWithdrawRequestStatus,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { CheckCircle, XCircle, Wallet, Clock, CheckCircle2, Building2 } from "lucide-react";

const AdminWithdrawTab = () => {
  const dispatch = useDispatch();
  const { withdrawRequests, isWithdrawLoading, withdrawError } = useSelector(
    (s) => s.admin,
  );

  useEffect(() => {
    dispatch(fetchWithdrawRequests());
  }, [dispatch]);

  const handleStatusUpdate = async (requestId, status, sellerName) => {
    const action = status === "Approved" ? "approve" : "reject";
    if (
      !window.confirm(
        `Are you sure you want to ${action} this withdrawal request from "${sellerName}"?`,
      )
    )
      return;

    const result = await dispatch(
      updateWithdrawRequestStatus(requestId, status),
    );
    if (result.success) {
      toast.success(`Withdrawal request ${status.toLowerCase()}!`);
    } else {
      toast.error(result.message || "Failed to update withdrawal status.");
    }
  };

  const statusColor = (status) => {
    const map = {
      Processing: "bg-amber-50 text-amber-700 border-amber-200",
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (isWithdrawLoading && (!withdrawRequests || withdrawRequests.length === 0)) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 rounded-3xl bg-white border border-slate-200/80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (withdrawError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-700 text-sm font-medium">
        Failed to load withdrawal requests: {withdrawError}
      </div>
    );
  }

  const pending = withdrawRequests.filter((r) => r.status === "Processing");
  const resolved = withdrawRequests.filter((r) => r.status !== "Processing");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Wallet className="w-3.5 h-3.5" />
            <span>Financial Settlements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Vendor Payout Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pending.length} pending approval · {resolved.length} resolved
          </p>
        </div>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pending Approval ({pending.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {pending.map((req) => (
              <WithdrawCard
                key={req._id}
                req={req}
                statusColor={statusColor}
                onApprove={() =>
                  handleStatusUpdate(req._id, "Approved", req.seller?.name)
                }
                onReject={() =>
                  handleStatusUpdate(req._id, "Rejected", req.seller?.name)
                }
                showActions
              />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Requests */}
      {resolved.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Resolved Payout History ({resolved.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {resolved.map((req) => (
              <WithdrawCard
                key={req._id}
                req={req}
                statusColor={statusColor}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {withdrawRequests.length === 0 && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-800 font-bold text-base">
            No withdrawal requests found
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Vendor payout requests will be listed here when submitted.
          </p>
        </div>
      )}
    </div>
  );
};

const WithdrawCard = ({
  req,
  statusColor,
  onApprove,
  onReject,
  showActions,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Seller Info */}
        <div className="flex items-center gap-3.5">
          <img
            src={getImageUrl(req.seller?.avatar?.url || req.seller?.avatar, "https://dummyimage.com/100")}
            alt={req.seller?.name}
            className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div>
            <p className="font-bold text-slate-900 text-base">
              {req.seller?.name || "Vendor"}
            </p>
            <p className="text-xs text-slate-400">{req.seller?.email}</p>
          </div>
        </div>

        {/* Amount & Status Badge */}
        <div className="flex flex-col sm:items-end gap-1.5">
          <span
            className={`inline-flex items-center self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusColor(req.status)}`}
          >
            {req.status}
          </span>
          <div className="sm:text-right">
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ${(req.netAmount || 0).toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">
              Gross: ${(req.amount || 0).toFixed(2)} · Fee (10%): ${(req.fee || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Account Info Box */}
      {req.bankInfo && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span><strong className="text-slate-800 font-semibold">Bank:</strong> {req.bankInfo.bankName}</span>
          </div>
          <div>
            <span><strong className="text-slate-800 font-semibold">Account #:</strong> {req.bankInfo.bankAccountNumber}</span>
          </div>
          <div>
            <span><strong className="text-slate-800 font-semibold">Holder:</strong> {req.bankInfo.bankHolderName}</span>
          </div>
          {req.bankInfo.bankSwiftCode && (
            <div>
              <span><strong className="text-slate-800 font-semibold">SWIFT:</strong> {req.bankInfo.bankSwiftCode}</span>
            </div>
          )}
        </div>
      )}

      {/* Date & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <p className="text-slate-400">
          Requested: {req.createdAt ? new Date(req.createdAt).toLocaleString() : "Recent"}
        </p>

        {showActions && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <CheckCircle size={14} />
              <span>Approve Payout</span>
            </button>
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition cursor-pointer"
            >
              <XCircle size={14} />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawTab;
