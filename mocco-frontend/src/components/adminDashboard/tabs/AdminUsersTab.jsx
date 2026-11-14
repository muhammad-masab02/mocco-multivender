import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteAdminUser,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { Trash2, Users, Search, Shield, User, Sparkles } from "lucide-react";

const AdminUsersTab = () => {
  const dispatch = useDispatch();
  const { users, isUsersLoading, usersError } = useSelector((s) => s.admin);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  if (isUsersLoading && users.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Accounts Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Registered Users ({users.length})
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-xs"
          />
        </div>
      </div>

      {usersError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {usersError}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredUsers.map((user) => {
                  const isAdminRole = String(user.role || "").toLowerCase() === "admin";
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(user.avatar?.url || user.avatar, "https://dummyimage.com/100")}
                            alt={user.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-bold text-slate-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isAdminRole
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {isAdminRole ? <Shield className="w-3 h-3 text-red-600" /> : <User className="w-3 h-3 text-slate-500" />}
                          <span>{user.role}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {!isAdminRole && (
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id, user.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
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

export default AdminUsersTab;
