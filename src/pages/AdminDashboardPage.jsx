import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-slate-600">{prefix}{payload[0]?.value}</p>
    </div>
  );
}

function SparkTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 shadow">
      {payload[0]?.value}
    </div>
  );
}

function KpiSparkline({ data, color }) {
  const points = data.map((value, idx) => ({ idx, value }));
  return (
    <div className="mt-3 h-14 w-full rounded-lg bg-white/10 p-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <Tooltip content={<SparkTooltip />} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.2} dot={false} activeDot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [checks, setChecks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({
    total_transactions: 0,
    total_captured_volume: 0,
    total_commission_earned: 0,
    total_gateway_fees: 0,
  });
  const [commissions, setCommissions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weeklyIndex, setWeeklyIndex] = useState(0);
  const [kpiDisplay, setKpiDisplay] = useState({
    revenue: 0,
    commission: 0,
    pending: 0,
    disputes: 0,
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, checksRes, txRes, commissionsRes, couponsRes, disputesRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/background-checks"),
        api.get("/admin/transactions"),
        api.get("/admin/commissions"),
        api.get("/admin/coupons"),
        api.get("/admin/disputes"),
      ]);

      const userRows = Array.isArray(usersRes.data?.users?.data) ? usersRes.data.users.data : [];
      const checkRows = Array.isArray(checksRes.data?.background_checks?.data) ? checksRes.data.background_checks.data : [];
      const txRows = Array.isArray(txRes.data?.transactions?.data) ? txRes.data.transactions.data : [];
      const txSummary = txRes.data?.summary || {};
      const commRows = Array.isArray(commissionsRes.data?.commissions?.data) ? commissionsRes.data.commissions.data : [];
      const couponRows = Array.isArray(couponsRes.data?.coupons?.data) ? couponsRes.data.coupons.data : [];
      const disputeRows = Array.isArray(disputesRes.data?.disputes?.data) ? disputesRes.data.disputes.data : [];

      setUsers(userRows);
      setChecks(checkRows);
      setTransactions(txRows);
      setTransactionSummary({
        total_transactions: Number(txSummary.total_transactions || 0),
        total_captured_volume: Number(txSummary.total_captured_volume || 0),
        total_commission_earned: Number(txSummary.total_commission_earned || 0),
        total_gateway_fees: Number(txSummary.total_gateway_fees || 0),
      });
      setCommissions(commRows);
      setCoupons(couponRows);
      setDisputes(disputeRows);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load admin dashboard.");
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
    loadAll();
  }, [navigate, user?.role]);

  const kpiCard = "relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#2f65d5_0%,#214da8_58%,#183d8b_100%)] p-4 text-white shadow-[0_14px_28px_rgba(31,63,147,0.32)]";
  const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = [38, 52, 46, 65, 72, 58, 61, 74, 55, 67, 49, 70];
  const weeklySeries = [
    [28, 42, 36, 51, 45, 59, 53],
    [31, 38, 44, 47, 41, 56, 61],
    [24, 33, 40, 43, 49, 54, 58],
    [36, 48, 39, 52, 47, 63, 60],
    [29, 35, 42, 46, 50, 57, 62],
  ];
  const weeklyData = weeklySeries[weeklyIndex] || weeklySeries[0];
  const monthlyChartData = monthlyData.map((value, index) => ({ month: monthlyLabels[index], sales: value }));
  const weeklyChartData = weeklyData.map((value, index) => ({ day: `D${index + 1}`, value }));
  const kpiTargets = useMemo(
    () => ({
      revenue: transactionSummary.total_captured_volume,
      commission: transactionSummary.total_commission_earned,
      pending: checks.filter((c) => c.status !== "passed").length,
      disputes: disputes.filter((d) => d.status === "open" || d.status === "in_review").length,
    }),
    [checks, disputes, transactionSummary.total_captured_volume, transactionSummary.total_commission_earned]
  );
  const kpiSeries = {
    revenue: [22, 28, 25, 34, 31, 40, 36, 44],
    commission: [8, 10, 9, 12, 11, 14, 13, 15],
    pending: [9, 8, 7, 7, 6, 5, 4, 4],
    disputes: [4, 5, 4, 3, 3, 2, 2, 1],
  };

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    let rafId = 0;

    const from = { ...kpiDisplay };
    const to = { ...kpiTargets };

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setKpiDisplay({
        revenue: from.revenue + (to.revenue - from.revenue) * easeOut,
        commission: from.commission + (to.commission - from.commission) * easeOut,
        pending: from.pending + (to.pending - from.pending) * easeOut,
        disputes: from.disputes + (to.disputes - from.disputes) * easeOut,
      });
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpiTargets]);

  if (loading) {
    return <AdminPageLoader label="Loading admin dashboard..." />;
  }

  return (
    <div>
      <div className="mb-5 rounded-2xl border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#eef4ff_100%)] p-5 shadow-sm">
        <h1 className="text-4xl font-bold text-[#1f2d6e]">Dashboard</h1>
      </div>

      {error ? <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={kpiCard}>
          <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10"></div>
          <p className="text-xs uppercase tracking-wide text-blue-100">Revenue</p>
          <p className="mt-1 text-4xl font-bold">${kpiDisplay.revenue.toFixed(2)}</p>
          <p className="mt-1 text-xs text-blue-100">Captured volume</p>
          <KpiSparkline data={kpiSeries.revenue} color="#dbeafe" />
        </div>
        <div className={kpiCard}>
          <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10"></div>
          <p className="text-xs uppercase tracking-wide text-blue-100">Commission</p>
          <p className="mt-1 text-4xl font-bold">${kpiDisplay.commission.toFixed(2)}</p>
          <p className="mt-1 text-xs text-blue-100">Platform earnings</p>
          <KpiSparkline data={kpiSeries.commission} color="#bfdbfe" />
        </div>
        <div className={kpiCard}>
          <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10"></div>
          <p className="text-xs uppercase tracking-wide text-blue-100">Taskers Pending</p>
          <p className="mt-1 text-4xl font-bold">{Math.round(kpiDisplay.pending)}</p>
          <p className="mt-1 text-xs text-blue-100">Background approvals needed</p>
          <KpiSparkline data={kpiSeries.pending} color="#93c5fd" />
        </div>
        <div className={kpiCard}>
          <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-white/10"></div>
          <p className="text-xs uppercase tracking-wide text-blue-100">Open Disputes</p>
          <p className="mt-1 text-4xl font-bold">{Math.round(kpiDisplay.disputes)}</p>
          <p className="mt-1 text-xs text-blue-100">Needs action</p>
          <KpiSparkline data={kpiSeries.disputes} color="#60a5fa" />
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1f2d6e]">Performance Snapshot</h2>
          <button type="button" onClick={loadAll} className="rounded-full bg-[#1e2756] px-4 py-2 text-xs font-semibold text-white">Refresh</button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-[#f4f7ff] p-4">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#d7e1fb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip prefix="Sales: " />} />
                  <Bar dataKey="sales" radius={[6, 6, 0, 0]} fill="#3f7be0" animationDuration={700} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl bg-[#f4f7ff] p-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1f2d6e]">Weekly Trend</p>
              <p className="text-[11px] font-semibold text-slate-500">Week {weeklyIndex + 1}</p>
            </div>
            <div className="mt-4 h-[95px] w-full rounded-xl bg-white p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyChartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltip prefix="Value: " />} />
                  <Line type="monotone" dataKey="value" stroke="#2f65d5" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} animationDuration={600} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <input
              type="range"
              min="0"
              max={weeklySeries.length - 1}
              step="1"
              value={weeklyIndex}
              onChange={(e) => setWeeklyIndex(Number(e.target.value))}
              className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white accent-[#2f65d5]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-semibold text-[#1f2d6e]">Overview</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-xs">
              <p className="text-slate-500">Total Users</p>
              <p className="text-xl font-bold text-[#1f2d6e]">{users.length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-xs">
              <p className="text-slate-500">Active Coupons</p>
              <p className="text-xl font-bold text-[#1f2d6e]">{coupons.filter((c) => c.is_active).length}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] p-3 text-xs">
              <p className="text-slate-500">Commission Models</p>
              <p className="text-xl font-bold text-[#1f2d6e]">{commissions.length}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-[#1f2d6e]">Latest Transactions</p>
            <div className="mt-2 space-y-2">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="rounded border border-slate-200 px-3 py-2 text-xs">
                  <p className="font-semibold text-slate-800">Payment #{t.id} - {t.task?.title || "Task"}</p>
                  <p className="text-slate-600">Status: {t.status} | Amount: ${t.task_amount} | Net: ${t.tasker_net_amount}</p>
                </div>
              ))}
              {transactions.length === 0 ? <p className="text-xs text-slate-500">No transactions yet.</p> : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-[#1f2d6e]">Action Queue</h2>
          <div className="mt-3 space-y-2 text-xs">
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] px-3 py-2">
              <p className="font-semibold text-slate-800">Background checks pending</p>
              <p className="text-slate-600">{checks.filter((c) => c.status !== "passed").length} require review</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] px-3 py-2">
              <p className="font-semibold text-slate-800">Open disputes</p>
              <p className="text-slate-600">{disputes.filter((d) => d.status === "open" || d.status === "in_review").length} need action</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#f7faff] px-3 py-2">
              <p className="font-semibold text-slate-800">Gateway fees</p>
              <p className="text-slate-600">${transactionSummary.total_gateway_fees.toFixed(2)} in captured payments</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Open each module from the left sidebar to manage details.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
