import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        device_name: "admin-web-ui",
      });

      if (response?.data?.user?.role !== "admin") {
        setError("This page is only for admin login.");
        return;
      }

      localStorage.setItem("alpine_token", response.data.token);
      localStorage.setItem("alpine_user", JSON.stringify(response.data.user));
      localStorage.removeItem("alpine_admin_locked");
      setSuccess("Admin login successful. Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 500);
    } catch (err) {
      setError(err?.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eceef5] px-4 py-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center">
        <div className="w-full max-w-[640px] rounded-md bg-white p-6 shadow-[0_12px_30px_rgba(31,45,110,0.12)] ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col items-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="h-12 w-auto" />
            <p className="mt-3 text-xs tracking-wide text-slate-500">Login to Alpine Tasker Administration</p>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-[11px] text-slate-400">Admin Access</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {error ? <p className="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="mb-3 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                className="h-12 w-full rounded-md border border-slate-300 pl-12 pr-4 text-base text-[#1f2d6e] placeholder:text-slate-400 focus:border-[#2f87d6] focus:outline-none"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input
                className="h-12 w-full rounded-md border border-slate-300 pl-12 pr-4 text-base text-[#1f2d6e] placeholder:text-slate-400 focus:border-[#2f87d6] focus:outline-none"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-right">
              <a href="/login" className="text-sm text-[#2f87d6] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              disabled={loading}
              className="h-11 w-full rounded-full bg-[#1e2756] text-lg font-semibold text-white hover:bg-[#182047] disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Need admin account? <Link to="/admin/signup" className="text-[#2f87d6] hover:underline">Admin Signup</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;
