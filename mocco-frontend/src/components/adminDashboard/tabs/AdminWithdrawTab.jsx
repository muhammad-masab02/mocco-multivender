import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWithdrawRequests,
  updateWithdrawRequestStatus,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { CheckCircle, XCircle } from "lucide-react";

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
      Processing: "bg-blue-100 text-blue-700",
      Approved: "bg-emerald-100 text-emerald-700",
      Rejected: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-slate-100 text-slate-600";
  };

  if (isWithdrawLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
          <p className="text-sm text-slate-500">Loading withdrawal requests…</p>
        </div>
      </div>
    );
  }

  if (withdrawError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">
          Failed to load withdrawal requests
        </p>
        <p className="mt-1 text-sm text-red-400">{withdrawError}</p>
      </div>
    );
  }

  const pending = withdrawRequests.filter((r) => r.status === "Processing");
  const resolved = withdrawRequests.filter((r) => r.status !== "Processing");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Withdrawal Requests
        </h2>
        <p className="text-sm text-slate-500">
          {pending.length} pending · {resolved.length} resolved
        </p>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-amber-700 uppercase tracking-wide">
            Pending Approval
          </h3>
          <div className="space-y-3">
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
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Resolved
          </h3>
          <div className="space-y-3">
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
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-400 text-sm">
            No withdrawal requests found.
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
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Seller Info */}
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(req.seller?.avatar)}
            alt={req.seller?.name}
            className="h-12 w-12 rounded-full object-cover border border-slate-200"
          />
          <div>
            <p className="font-semibold text-slate-800">
              {req.seller?.name || "Unknown Seller"}
            </p>
            <p className="text-xs text-slate-400">{req.seller?.email}</p>
          </div>
        </div>

        {/* Amount & Status */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(req.status)}`}
          >
            {req.status}
          </span>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900">
              ${req.netAmount?.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400">
              Gross: ${req.amount?.toFixed(2)} · Fee: ${req.fee?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Info */}
      {req.bankInfo && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-medium">Bank:</span> {req.bankInfo.bankName}
          </p>
          <p>
            <span className="font-medium">Account:</span>{" "}
            {req.bankInfo.bankAccountNumber}
          </p>
          <p>
            <span className="font-medium">Holder:</span>{" "}
            {req.bankInfo.bankHolderName}
          </p>
          {req.bankInfo.bankSwiftCode && (
            <p>
              <span className="font-medium">SWIFT:</span>{" "}
              {req.bankInfo.bankSwiftCode}
            </p>
          )}
        </div>
      )}

      {/* Date */}
      <p className="mt-3 text-xs text-slate-400">
        Submitted: {new Date(req.createdAt).toLocaleString()}
      </p>

      {/* Actions */}
      {showActions && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={onApprove}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
          >
            <CheckCircle size={15} />
            Approve
          </button>
          <button
            onClick={onReject}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
          >
            <XCircle size={15} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawTab;
