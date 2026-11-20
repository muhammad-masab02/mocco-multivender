import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import TableShell from "../shared/TableShell";
import TableActionMenu from "../shared/TableActionMenu";
import TruncateTextCell from "../shared/TruncateTextCell";
import EditProductOrEventModal from "../modals/EditProductOrEventModal";
import { deleteEvent, getEvents } from "../../../services/store/actions/event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getEventStatus = (item) => {
  if (item?.status === "Paused") return "Paused";
  if (!item?.endDate) return item?.status || "Running";
  const now = new Date();
  const end = new Date(item.endDate);
  if (end < now) return "Ended";
  if (item?.startDate && new Date(item.startDate) > now) return "Upcoming";
  return item?.status || "Running";
};

const AllEventsTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seller } = useSelector((state) => state.seller);
  const shopId = seller?._id;

  const {
    events,
    isLoading: isEventLoading,
    error: eventError,
  } = useSelector((state) => state.event);

  const [editingEvent, setEditingEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (shopId) {
      dispatch(getEvents(shopId));
    }
  }, [dispatch, shopId]);

  const handlePreviewRoute = (productId) => {
    if (!productId) return;
    navigate(`/product-detail/${productId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await dispatch(deleteEvent(eventId));
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to delete event");
    }
  };

  const allEventsList = useMemo(() => (Array.isArray(events) ? events : []), [events]);

  const runningCount = useMemo(
    () => allEventsList.filter((e) => getEventStatus(e) === "Running").length,
    [allEventsList]
  );
  const endedCount = useMemo(
    () => allEventsList.filter((e) => getEventStatus(e) === "Ended").length,
    [allEventsList]
  );
  const upcomingCount = useMemo(
    () => allEventsList.filter((e) => getEventStatus(e) === "Upcoming").length,
    [allEventsList]
  );

  const filteredEvents = useMemo(() => {
    if (statusFilter === "all") return allEventsList;
    return allEventsList.filter((e) => getEventStatus(e) === statusFilter);
  }, [allEventsList, statusFilter]);

  const rows =
    filteredEvents.length > 0
      ? filteredEvents.map((item, i) => {
          const eventId = item?._id;
          const status = getEventStatus(item);

          const actionList = [
            {
              label: "Preview",
              icon: "preview",
              onClick: () => handlePreviewRoute(eventId),
            },
            {
              label: "Edit",
              icon: "edit",
              onClick: () => setEditingEvent(item),
            },
            {
              label: "Delete",
              icon: "delete",
              variant: "danger",
              onClick: () => handleDeleteEvent(eventId),
            },
          ];

          return [
            <TruncateTextCell
              key={`event-id-${i}`}
              text={eventId || i}
              maxWidthClass="max-w-36"
              mono
            />,
            <TruncateTextCell
              key={`event-name-${i}`}
              text={item?.name || "Unnamed Event"}
              maxWidthClass="max-w-48"
            />,
            `US$ ${item?.discount_price ?? item?.price ?? 0}`,
            item?.stock ?? 0,
            item?.total_sell ?? 0,
            <span
              key={`event-status-${i}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                status === "Running"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : status === "Ended"
                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                  : status === "Upcoming"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-amber-100 text-amber-700 border border-amber-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "Running"
                    ? "bg-emerald-500 animate-pulse"
                    : status === "Ended"
                    ? "bg-rose-500"
                    : status === "Upcoming"
                    ? "bg-blue-500"
                    : "bg-amber-500"
                }`}
              />
              {status}
            </span>,
            item?.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
            item?.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
            <TableActionMenu key={`event-actions-${i}`} actions={actionList} />,
          ];
        })
      : [
          [
            eventError ||
              (allEventsList.length === 0
                ? "No events found for this shop."
                : `No events matching status: ${statusFilter}`),
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
            "-",
          ],
        ];

  return (
    <>
      {/* Status filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All ({allEventsList.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("Running")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === "Running"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Running ({runningCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("Ended")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === "Ended"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          Ended ({endedCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("Upcoming")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            statusFilter === "Upcoming"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Upcoming ({upcomingCount})
        </button>
      </div>

      <TableShell
        columns={[
          "Event Id",
          "Name",
          "Price",
          "Stock",
          "Sold",
          "Status",
          "Start",
          "End",
          "Actions",
        ]}
        rows={rows}
        productLoading={isEventLoading}
      />

      {editingEvent && (
        <EditProductOrEventModal
          item={editingEvent}
          mode="event"
          onClose={() => setEditingEvent(null)}
        />
      )}
    </>
  );
};

export default AllEventsTab;
