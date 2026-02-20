import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

function AdminUsersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [message]);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadUsers = async (selectedRole = role) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users", {
        params: {
          role: selectedRole || undefined,
        },
      });
      const list = Array.isArray(res.data?.users?.data) ? res.data.users.data : [];
      setRows(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token || user?.role !== "admin") {
      navigate("/admin");
      return;
    }
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user?.role]);

  const updateStatus = async (targetUser, isActive) => {
    setSavingId(targetUser.id);
    setError("");
    setMessage("");
    try {
      await api.post(`/admin/users/${targetUser.id}/status`, { is_active: isActive });
      setMessage(`User ${isActive ? "activated" : "deactivated"} successfully.`);
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update user status.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading users..." />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Users Management</h1>
          <p className="mt-1 text-sm text-slate-600">Activate/deactivate users and review tasker profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="h-10 appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-14 text-xs font-semibold text-slate-700"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                loadUsers(e.target.value);
              }}
            >
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="tasker">Tasker</option>
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <button type="button" onClick={() => loadUsers()} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading users...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No users found.</p> : null}

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded border border-slate-200 px-3 py-3 text-xs">
              <p className="font-semibold text-slate-800">{row.name} ({row.email})</p>
              <p className="mt-1 text-slate-600">
                Role: {row.role} | Active: {row.is_active ? "Yes" : "No"}
              </p>
              {row.role === "tasker" ? (
                <p className="mt-1 text-slate-600">
                  Background Check: {row.background_check?.status || "not_started"} | Skills: {row.tasker_profile?.skills_text || "-"}
                </p>
              ) : null}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={savingId === row.id}
                  onClick={() => updateStatus(row, true)}
                  className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                >
                  Activate
                </button>
                <button
                  type="button"
                  disabled={savingId === row.id}
                  onClick={() => updateStatus(row, false)}
                  className="rounded-full border border-red-300 px-3 py-1 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-70"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminUsersPage;
