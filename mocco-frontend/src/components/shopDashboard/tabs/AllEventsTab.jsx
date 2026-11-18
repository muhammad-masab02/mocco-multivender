import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TableShell from "../shared/TableShell";
import TableActionMenu from "../shared/TableActionMenu";
import TruncateTextCell from "../shared/TruncateTextCell";
import EditProductOrEventModal from "../modals/EditProductOrEventModal";
import { deleteEvent, getEvents } from "../../../services/store/actions/event";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const rows =
    events?.length > 0
      ? events?.map((item, i) => {
          const eventId = item?._id;

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
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                item?.status === "Running"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item?.status || "Running"}
            </span>,
            item?.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
            item?.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
            <TableActionMenu key={`event-actions-${i}`} actions={actionList} />,
          ];
        })
      : [
          [
            eventError || "No events found for this shop.",
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
