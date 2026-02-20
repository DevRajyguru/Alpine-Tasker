import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageLoader from "../components/AdminPageLoader";
import { api } from "../lib/api";

const initialCouponForm = {
  code: "",
  type: "percent",
  value: "",
  max_discount: "",
  min_order_amount: "",
  usage_limit: "",
  is_active: true,
};

function AdminCouponsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [couponForm, setCouponForm] = useState(initialCouponForm);
  const [filters, setFilters] = useState({
    code: "",
    type: "",
    is_active: "",
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!message) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [message]);

  const loadCoupons = async (page = 1, activeFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/coupons", {
        params: {
          page,
          per_page: 10,
          code: activeFilters.code || undefined,
          type: activeFilters.type || undefined,
          is_active: activeFilters.is_active || undefined,
        },
      });

      const paged = res.data?.coupons || {};
      setRows(Array.isArray(paged.data) ? paged.data : []);
      setMeta({
        current_page: Number(paged.current_page || 1),
        last_page: Number(paged.last_page || 1),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load coupons.");
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
    loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, user?.role]);

  const applyFilters = async (event) => {
    event.preventDefault();
    await loadCoupons(1, filters);
  };

  const resetFilters = async () => {
    const cleared = { code: "", type: "", is_active: "" };
    setFilters(cleared);
    await loadCoupons(1, cleared);
  };

  const saveCoupon = async (event) => {
    event.preventDefault();
    setSavingKey("coupon");
    setError("");
    setMessage("");
    try {
      await api.post("/admin/coupons", {
        code: couponForm.code,
        type: couponForm.type,
        value: Number(couponForm.value),
        max_discount: couponForm.max_discount !== "" ? Number(couponForm.max_discount) : null,
        min_order_amount: couponForm.min_order_amount !== "" ? Number(couponForm.min_order_amount) : null,
        usage_limit: couponForm.usage_limit !== "" ? Number(couponForm.usage_limit) : null,
        is_active: couponForm.is_active,
      });
      setCouponForm(initialCouponForm);
      setMessage("Coupon created.");
      await loadCoupons(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create coupon.");
    } finally {
      setSavingKey("");
    }
  };

  const toggleCouponStatus = async (coupon) => {
    setSavingKey(`coupon-${coupon.id}`);
    setError("");
    setMessage("");
    try {
      await api.put(`/admin/coupons/${coupon.id}`, {
        is_active: !coupon.is_active,
      });
      setMessage("Coupon status updated.");
      await loadCoupons(meta.current_page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update coupon.");
    } finally {
      setSavingKey("");
    }
  };

  const deleteCoupon = async (couponId) => {
    setSavingKey(`coupon-del-${couponId}`);
    setError("");
    setMessage("");
    try {
      await api.delete(`/admin/coupons/${couponId}`);
      setMessage("Coupon deleted.");
      const page = rows.length === 1 && meta.current_page > 1 ? meta.current_page - 1 : meta.current_page;
      await loadCoupons(page);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete coupon.");
    } finally {
      setSavingKey("");
    }
  };

  if (loading && rows.length === 0) {
    return <AdminPageLoader label="Loading coupons..." />;
  }

  return (
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#1f2d6e]">Coupons</h1>
            <p className="mt-1 text-sm text-slate-600">Create and manage coupon discounts for customer payments.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => loadCoupons(meta.current_page)} className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">Refresh</button>
          </div>
        </div>

        {error ? <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p> : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-[#1f2d6e]">Create Coupon</h2>
            <form className="mt-3 space-y-2" onSubmit={saveCoupon}>
              <input className="h-10 w-full rounded border border-slate-200 px-3 text-xs" placeholder="Code" value={couponForm.code} onChange={(e) => setCouponForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} required />
              <div className="grid grid-cols-2 gap-2">
                <select className="h-10 rounded border border-slate-200 px-3 text-xs" value={couponForm.type} onChange={(e) => setCouponForm((p) => ({ ...p, type: e.target.value }))}>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed</option>
                </select>
                <input className="h-10 rounded border border-slate-200 px-3 text-xs" type="number" step="0.01" min="0" placeholder="Value" value={couponForm.value} onChange={(e) => setCouponForm((p) => ({ ...p, value: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="h-10 rounded border border-slate-200 px-3 text-xs" type="number" step="0.01" min="0" placeholder="Max discount" value={couponForm.max_discount} onChange={(e) => setCouponForm((p) => ({ ...p, max_discount: e.target.value }))} />
                <input className="h-10 rounded border border-slate-200 px-3 text-xs" type="number" step="0.01" min="0" placeholder="Min order amount" value={couponForm.min_order_amount} onChange={(e) => setCouponForm((p) => ({ ...p, min_order_amount: e.target.value }))} />
              </div>
              <input className="h-10 w-full rounded border border-slate-200 px-3 text-xs" type="number" min="1" placeholder="Usage limit (optional)" value={couponForm.usage_limit} onChange={(e) => setCouponForm((p) => ({ ...p, usage_limit: e.target.value }))} />
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={couponForm.is_active} onChange={(e) => setCouponForm((p) => ({ ...p, is_active: e.target.checked }))} />
                Active
              </label>
              <button disabled={savingKey === "coupon"} className="h-10 w-full rounded-full bg-[#1e2756] px-3 text-xs font-semibold text-white disabled:opacity-70">
                {savingKey === "coupon" ? "Saving..." : "Create Coupon"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold text-[#1f2d6e]">Coupon List</h2>
            <form className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4" onSubmit={applyFilters}>
              <input className="h-10 rounded border border-slate-200 px-3 text-xs" placeholder="Search code" value={filters.code} onChange={(e) => setFilters((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
              <select className="h-10 rounded border border-slate-200 px-3 text-xs" value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
                <option value="">All types</option>
                <option value="percent">Percent</option>
                <option value="fixed">Fixed</option>
              </select>
              <select className="h-10 rounded border border-slate-200 px-3 text-xs" value={filters.is_active} onChange={(e) => setFilters((p) => ({ ...p, is_active: e.target.value }))}>
                <option value="">All status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="h-10 rounded-full bg-[#1e2756] px-4 text-xs font-semibold text-white">Apply</button>
                <button type="button" onClick={resetFilters} className="h-10 rounded-full border border-slate-300 px-4 text-xs font-semibold text-slate-700">Clear</button>
              </div>
            </form>

            <div className="mt-3 space-y-2">
              {loading ? <p className="text-sm text-slate-500">Loading coupons...</p> : null}
              {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No coupons found.</p> : null}
              {rows.map((coupon) => (
                <div key={coupon.id} className="rounded border border-slate-200 px-3 py-2 text-xs">
                  <p className="font-semibold text-slate-800">{coupon.code} ({coupon.type})</p>
                  <p className="text-slate-600">
                    Value: {coupon.value} | Used: {coupon.used_count}/{coupon.usage_limit || "unlimited"} | Active: {coupon.is_active ? "Yes" : "No"}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={savingKey === `coupon-${coupon.id}`}
                      onClick={() => toggleCouponStatus(coupon)}
                      className="h-8 rounded-full border border-slate-300 px-3 text-[11px] font-semibold text-slate-700 disabled:opacity-70"
                    >
                      {coupon.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === `coupon-del-${coupon.id}`}
                      onClick={() => deleteCoupon(coupon.id)}
                      className="h-8 rounded-full border border-red-300 px-3 text-[11px] font-semibold text-red-700 disabled:opacity-70"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={meta.current_page <= 1}
                onClick={() => loadCoupons(meta.current_page - 1)}
                className="h-9 rounded-full border border-slate-300 px-4 text-xs font-semibold text-slate-700 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs text-slate-600">Page {meta.current_page} of {meta.last_page}</span>
              <button
                type="button"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => loadCoupons(meta.current_page + 1)}
                className="h-9 rounded-full border border-slate-300 px-4 text-xs font-semibold text-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}

export default AdminCouponsPage;
