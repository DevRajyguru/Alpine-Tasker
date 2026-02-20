import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

function AdminTaskersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
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

  const loadTaskers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users", {
        params: {
          role: "tasker",
        },
      });
      const list = Array.isArray(res.data?.users?.data) ? res.data.users.data : [];
      setRows(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load taskers.");
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
    loadTaskers();
  }, [navigate, user?.role]);

  const updateStatus = async (targetUser, isActive) => {
    setSavingId(targetUser.id);
    setError("");
    setMessage("");
    try {
      await api.post(`/admin/users/${targetUser.id}/status`, { is_active: isActive });
      setMessage(`Tasker ${isActive ? "activated" : "deactivated"} successfully.`);
      await loadTaskers();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update tasker status.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading taskers..." />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Taskers Management</h1>
          <p className="mt-1 text-sm text-slate-600">Manage tasker accounts, activation, and profile/background details.</p>
        </div>
        <button type="button" onClick={loadTaskers} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">
          Refresh
        </button>
      </div>

      {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading taskers...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No taskers found.</p> : null}

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded border border-slate-200 px-3 py-3 text-xs">
              <p className="font-semibold text-slate-800">{row.name} ({row.email})</p>
              <p className="mt-1 text-slate-600">
                Active: {row.is_active ? "Yes" : "No"}
              </p>
              <p className="mt-1 text-slate-600">
                Background Check: {row.background_check?.status || "not_started"}
              </p>
              <p className="mt-1 text-slate-600">
                Skills: {row.tasker_profile?.skills_text || "-"}
              </p>
              <p className="mt-1 text-slate-600">
                Hourly Rate: {row.tasker_profile?.hourly_rate ? `$${Number(row.tasker_profile.hourly_rate).toFixed(2)}` : "-"}
              </p>
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

export default AdminTaskersPage;
