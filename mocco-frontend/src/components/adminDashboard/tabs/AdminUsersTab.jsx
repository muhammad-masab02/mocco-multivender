import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteAdminUser,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { Trash2 } from "lucide-react";

const AdminUsersTab = () => {
  const dispatch = useDispatch();
  const { users, isUsersLoading, usersError } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`))
      return;
    const result = await dispatch(deleteAdminUser(userId));
    if (result.success) {
      toast.success("User deleted successfully!");
    } else {
      toast.error(result.message || "Failed to delete user.");
    }
  };

  if (isUsersLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          <p className="text-sm text-slate-500">Loading users…</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load users</p>
        <p className="mt-1 text-sm text-red-400">{usersError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Users</h2>
          <p className="text-sm text-slate-500">
            {users.length} registered users
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    User
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user, i) => (
                  <tr
                    key={user._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(user.avatar)}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-sm font-medium text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersTab;
