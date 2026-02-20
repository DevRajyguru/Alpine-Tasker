import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const initialForm = {
  commission_type: "percent",
  commission_value: "10",
  is_active: true,
};

function AdminCommissionsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const loadCommissions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/commissions");
      const list = Array.isArray(res.data?.commissions?.data) ? res.data.commissions.data : [];
      setRows(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load commissions.");
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
    loadCommissions();
  }, [navigate, user?.role]);

  const saveCommission = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.post("/admin/commissions", {
        commission_type: form.commission_type,
        commission_value: Number(form.commission_value),
        is_active: form.is_active,
      });
      setMessage("Commission setting saved.");
      setForm(initialForm);
      await loadCommissions();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save commission.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading commissions..." />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Commissions</h1>
          <p className="mt-1 text-sm text-slate-600">Set fixed percentage or fixed amount commission.</p>
        </div>
        <button type="button" onClick={loadCommissions} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">
          Refresh
        </button>
      </div>

      {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <form onSubmit={saveCommission} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#1f2d6e]">Create Commission Rule</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="relative">
              <select
                className="h-10 w-full appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-14 text-xs font-semibold text-slate-700"
                value={form.commission_type}
                onChange={(e) => setForm((prev) => ({ ...prev, commission_type: e.target.value }))}
              >
                <option value="percent">Percent</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              className="h-10 rounded-full border border-slate-300 px-4 text-xs"
              placeholder="Value"
              value={form.commission_value}
              onChange={(e) => setForm((prev) => ({ ...prev, commission_value: e.target.value }))}
              required
            />
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
            />
            Set as active
          </label>
          <button
            type="submit"
            disabled={saving}
            className="mt-3 h-10 w-full rounded-full bg-[#1e2756] text-xs font-semibold text-white disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Commission"}
          </button>
        </form>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-[#1f2d6e]">Commission History</p>
          <div className="mt-3 space-y-2">
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No commission records found.</p> : null}
            {rows.map((row) => (
              <div key={row.id} className="rounded border border-slate-200 px-3 py-2 text-xs">
                <p className="font-semibold text-slate-800">
                  {row.commission_type} - {row.commission_value}
                  {row.commission_type === "percent" ? "%" : " USD"}
                </p>
                <p className="text-slate-600">
                  Active: {row.is_active ? "Yes" : "No"} | Effective: {row.effective_from ? new Date(row.effective_from).toLocaleString() : "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminCommissionsPage;
