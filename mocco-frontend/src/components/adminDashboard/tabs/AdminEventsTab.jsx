import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdminEvents } from "../../../services/store/actions/admin";
import { getImageUrl } from "../../../utils/imageUrl";

const AdminEventsTab = () => {
  const dispatch = useDispatch();
  const { events, isEventsLoading, eventsError } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAllAdminEvents());
  }, [dispatch]);

  if (isEventsLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-500" />
          <p className="text-sm text-slate-500">Loading events…</p>
        </div>
      </div>
    );
  }

  if (eventsError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load events</p>
        <p className="mt-1 text-sm text-red-400">{eventsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">All Events</h2>
        <p className="text-sm text-slate-500">
          {events.length} events on platform
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No events found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Event
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Shop
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((event, i) => {
                  const now = new Date();
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);
                  const isActive = now >= start && now <= end;
                  const isUpcoming = now < start;

                  return (
                    <tr
                      key={event._id}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(event.images?.[0])}
                            alt={event.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                          />
                          <p className="max-w-45 truncate text-sm font-medium text-slate-800">
                            {event.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {event.shop?.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                        ${event.discountedPrice ?? event.originalPrice ?? 0}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {start.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {end.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : isUpcoming
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : isUpcoming
                              ? "Upcoming"
                              : "Ended"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsTab;
