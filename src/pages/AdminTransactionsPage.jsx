import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

function AdminTransactionsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    total_transactions: 0,
    total_captured_volume: 0,
    total_commission_earned: 0,
    total_gateway_fees: 0,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadTransactions = async (selectedStatus = status) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/transactions", {
        params: {
          status: selectedStatus || undefined,
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
      setError(err?.response?.data?.message || "Failed to load transactions.");
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
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user?.role]);

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading transactions..." />;
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Transactions</h1>
          <p className="mt-1 text-sm text-slate-600">View payment and transaction records.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="h-10 appearance-none rounded-full border border-slate-300 bg-white pl-4 pr-16 text-xs font-semibold text-slate-700"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                loadTransactions(e.target.value);
              }}
            >
              <option value="">All status</option>
              <option value="authorized">Authorized</option>
              <option value="captured">Captured</option>
              <option value="released">Released</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <button type="button" onClick={() => loadTransactions()} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">
            Refresh
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Total Transactions</p>
          <p className="mt-1 text-2xl font-bold text-[#1f2d6e]">{summary.total_transactions}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Captured Volume</p>
          <p className="mt-1 text-2xl font-bold text-[#1f2d6e]">${summary.total_captured_volume.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Commission Earned</p>
          <p className="mt-1 text-2xl font-bold text-[#1f2d6e]">${summary.total_commission_earned.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Gateway Fees</p>
          <p className="mt-1 text-2xl font-bold text-[#1f2d6e]">${summary.total_gateway_fees.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {loading ? <p className="text-sm text-slate-500">Loading transactions...</p> : null}
        {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No transactions found.</p> : null}

        <div className="space-y-2">
          {rows.map((t) => (
            <div key={t.id} className="rounded border border-slate-200 px-3 py-2 text-xs">
              <p className="font-semibold text-slate-800">Payment #{t.id} - {t.task?.title || "Task"}</p>
              <p className="text-slate-600">
                Status: {t.status} | Amount: ${t.task_amount} | Captured: ${t.captured_amount} | Net: ${t.tasker_net_amount}
              </p>
              <p className="text-slate-600">
                Customer: {t.customer?.email || "-"} | Tasker: {t.tasker?.email || "-"}
              </p>
              <p className="text-slate-500">Date: {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminTransactionsPage;
