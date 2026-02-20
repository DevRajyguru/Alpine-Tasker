import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const formatDateInput = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function AdminEarningsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total_transactions: 0,
    total_captured_volume: 0,
    total_commission_earned: 0,
    total_gateway_fees: 0,
  });
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const load = async (from = dateFrom, to = dateTo) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/transactions", {
        params: {
          status: "captured",
          date_from: from || undefined,
          date_to: to || undefined,
        },
      });
      const txRows = Array.isArray(res.data?.transactions?.data) ? res.data.transactions.data : [];
      const s = res.data?.summary || {};
      setRows(txRows);
      setSummary({
        total_transactions: Number(s.total_transactions || 0),
        total_captured_volume: Number(s.total_captured_volume || 0),
        total_commission_earned: Number(s.total_commission_earned || 0),
        total_gateway_fees: Number(s.total_gateway_fees || 0),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load earnings.");
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
      navigate("/admin");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user?.role]);

  const applyToday = () => {
    const today = formatDateInput(new Date());
    setDateFrom(today);
    setDateTo(today);
    load(today, today);
  };

  const applyThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    const from = formatDateInput(monday);
    const to = formatDateInput(now);
    setDateFrom(from);
    setDateTo(to);
    load(from, to);
  };

  const applyThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = formatDateInput(firstDay);
    const to = formatDateInput(now);
    setDateFrom(from);
    setDateTo(to);
    load(from, to);
  };

  const clearFilter = () => {
    setDateFrom("");
    setDateTo("");
    load("", "");
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading earnings..." />;
  }

  return (
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1f2d6e]">Earnings Report</h1>
            <p className="mt-1 text-sm text-slate-600">View platform earnings by date range.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => load()} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">Refresh</button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
            <button type="button" onClick={applyToday} className="h-10 rounded-full border border-slate-300 px-3 text-xs font-semibold text-slate-700">Today</button>
            <button type="button" onClick={applyThisWeek} className="h-10 rounded-full border border-slate-300 px-3 text-xs font-semibold text-slate-700">This Week</button>
            <button type="button" onClick={applyThisMonth} className="h-10 rounded-full border border-slate-300 px-3 text-xs font-semibold text-slate-700">This Month</button>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-10 rounded border border-slate-200 px-3 text-xs" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-10 rounded border border-slate-200 px-3 text-xs" />
            <div className="flex gap-2">
              <button type="button" onClick={() => load(dateFrom, dateTo)} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">Apply</button>
              <button type="button" onClick={clearFilter} className="h-10 rounded-full border border-slate-300 px-4 text-xs font-semibold text-slate-700">Clear</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 text-xs">
              <p className="text-slate-500">Captured Transactions</p>
              <p className="text-lg font-semibold text-[#1f2d6e]">{summary.total_transactions}</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 text-xs">
              <p className="text-slate-500">Total Earnings</p>
              <p className="text-lg font-semibold text-[#1f2d6e]">${summary.total_commission_earned.toFixed(2)}</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 text-xs">
              <p className="text-slate-500">Captured Volume</p>
              <p className="text-lg font-semibold text-[#1f2d6e]">${summary.total_captured_volume.toFixed(2)}</p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3 text-xs">
              <p className="text-slate-500">Gateway Fees</p>
              <p className="text-lg font-semibold text-[#1f2d6e]">${summary.total_gateway_fees.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No captured transactions in selected range.</p> : null}
            {rows.map((t) => (
              <div key={t.id} className="rounded border border-slate-200 px-3 py-2 text-xs">
                <p className="font-semibold text-slate-800">Payment #{t.id} - {t.task?.title || "Task"}</p>
                <p className="text-slate-600">
                  Captured: ${t.captured_amount} | Commission: ${t.commission_amount} | Net: ${t.tasker_net_amount}
                </p>
                <p className="text-slate-600">Date: {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default AdminEarningsPage;
