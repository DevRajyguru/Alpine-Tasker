import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function AdminLockScreenPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    if (!token || user?.role !== "admin") {
      navigate("/admin");
      return;
    }
    if (localStorage.getItem("alpine_admin_locked") !== "1") {
      navigate("/admin/dashboard");
    }
  }, [navigate, user?.role]);

  const unlock = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", {
        email: user?.email,
        password,
        device_name: "admin-lock-screen",
      });

      if (response?.data?.user?.role !== "admin") {
        setError("Only admin can unlock this screen.");
        return;
      }

      localStorage.setItem("alpine_token", response.data.token);
      localStorage.setItem("alpine_user", JSON.stringify(response.data.user));
      localStorage.removeItem("alpine_admin_locked");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef3fb] px-4 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_14px_40px_rgba(31,45,110,0.12)]">
          <div className="mb-6 text-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="mx-auto h-12 w-auto rounded-lg" />
            <p className="mt-3 text-sm text-slate-600">Admin screen is locked</p>
          </div>

          {error ? <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

          <form className="space-y-3" onSubmit={unlock}>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-md border border-slate-300 px-4 text-base text-slate-800 outline-none focus:border-[#2f87d6]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-[#2f65d5] text-lg font-semibold text-white hover:bg-[#2558c3] disabled:opacity-70"
            >
              {loading ? "Unlocking..." : "Unlock"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AdminLockScreenPage;

