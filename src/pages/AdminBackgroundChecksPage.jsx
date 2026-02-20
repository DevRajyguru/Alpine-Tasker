import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const statuses = ["not_started", "pending", "passed", "failed", "review_required"];

function AdminBackgroundChecksPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [statusById, setStatusById] = useState({});
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

  const loadChecks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/background-checks");
      const list = Array.isArray(res.data?.background_checks?.data) ? res.data.background_checks.data : [];
      setRows(list);
      const map = {};
      list.forEach((row) => {
        map[row.id] = row.status || "pending";
      });
      setStatusById(map);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load background checks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token) {
      navigate("/admin");
      return;
    }
    if (user?.role !== "admin") {
      if (user?.role === "customer") {
        navigate("/customer/tasks");
        return;
      }
      if (user?.role === "tasker") {
        navigate("/tasker/dashboard");
        return;
      }
      navigate("/admin");
      return;
    }
    loadChecks();
  }, [navigate, user?.role]);

  const updateStatus = async (backgroundCheckId, forceStatus = null) => {
    setSavingId(backgroundCheckId);
    setError("");
    setMessage("");
    try {
      const status = forceStatus || statusById[backgroundCheckId] || "pending";
      await api.post(`/admin/background-checks/${backgroundCheckId}/status`, { status });
      setMessage(`Background check updated to '${status}'.`);
      await loadChecks();
    } catch (err) {
      setError(err?.response?.data?.message || "Status update failed.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading background checks..." />;
  }

  return (
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1f2d6e]">Background Check Approvals</h1>
            <p className="mt-1 text-xs text-slate-500">Approve taskers by setting status to passed.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadChecks}
              className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white hover:bg-[#1a214b]"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          {loading ? <p className="text-sm text-slate-500">Loading background checks...</p> : null}
          {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No background checks found.</p> : null}

          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#1f2d6e]">
                      Check #{row.id} - {row.tasker?.name || `Tasker ID: ${row.tasker_id}`}
                    </p>
                    <p className="text-xs text-slate-600">
                      {row.tasker?.email ? `Email: ${row.tasker.email} | ` : ""}
                      Provider: {row.provider} | Current Status: {row.status}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase text-slate-700">
                    {row.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    className="h-9 rounded border border-slate-200 px-3 text-xs"
                    value={statusById[row.id] || row.status}
                    onChange={(e) => setStatusById((prev) => ({ ...prev, [row.id]: e.target.value }))}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => updateStatus(row.id)}
                    className="h-9 rounded-full border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                  >
                    {savingId === row.id ? "Saving..." : "Update"}
                  </button>
                  <button
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => updateStatus(row.id, "passed")}
                    className="h-9 rounded-full bg-[#1e2756] px-3 text-xs font-semibold text-white hover:bg-[#1a214b] disabled:opacity-70"
                  >
                    Approve (Passed)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default AdminBackgroundChecksPage;
