import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const statuses = ["open", "in_review", "resolved", "closed", "rejected"];

function AdminDisputesPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [statusById, setStatusById] = useState({});
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

  const loadDisputes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/disputes");
      const list = Array.isArray(res.data?.disputes?.data) ? res.data.disputes.data : [];
      setRows(list);
      const next = {};
      list.forEach((d) => {
        next[d.id] = d.status || "open";
      });
      setStatusById(next);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load disputes.");
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
    loadDisputes();
  }, [navigate, user?.role]);

  const updateStatus = async (disputeId) => {
    setSavingId(disputeId);
    setError("");
    setMessage("");
    try {
      const status = statusById[disputeId] || "open";
      await api.post(`/admin/disputes/${disputeId}/status`, { status });
      setMessage("Dispute status updated.");
      await loadDisputes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update dispute status.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading disputes..." />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Disputes Management</h1>
          <p className="mt-1 text-sm text-slate-600">Review disputes and update ticket status.</p>
        </div>
        <button type="button" onClick={loadDisputes} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">
          Refresh
        </button>
      </div>

      {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading disputes...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No disputes found.</p> : null}
        <div className="space-y-3">
          {rows.map((d) => (
            <div key={d.id} className="rounded border border-slate-200 px-3 py-3 text-xs">
              <p className="font-semibold text-slate-800">#{d.id} {d.subject}</p>
              <p className="mt-1 text-slate-600">{d.description}</p>
              <p className="mt-1 text-slate-600">
                Task: {d.task?.title || `#${d.task_id}`} | Raised by: {d.raised_by?.email || "-"} | Against: {d.against_user?.email || "-"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="relative">
                  <select
                    className="h-9 appearance-none rounded-full border border-slate-300 bg-white pl-3 pr-12"
                    value={statusById[d.id] || d.status}
                    onChange={(e) => setStatusById((prev) => ({ ...prev, [d.id]: e.target.value }))}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <button
                  type="button"
                  disabled={savingId === d.id}
                  onClick={() => updateStatus(d.id)}
                  className="h-9 rounded-full bg-[#1e2756] px-4 font-semibold text-white disabled:opacity-70"
                >
                  {savingId === d.id ? "Saving..." : "Update Status"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDisputesPage;
