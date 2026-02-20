import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function AdminSignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [adminSignupKey, setAdminSignupKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: "admin",
        admin_signup_key: adminSignupKey,
      });

      localStorage.setItem("alpine_token", res.data.token);
      localStorage.setItem("alpine_user", JSON.stringify(res.data.user));
      setSuccess("Admin signup successful. Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 700);
    } catch (err) {
      setError(err?.response?.data?.message || "Admin signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f5f7fb] py-16">
      <section className="mx-auto max-w-xl px-6">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h1 className="text-3xl font-bold text-[#1f2d6e]">Admin Signup</h1>
          <p className="mt-2 text-sm text-slate-600">Create an admin account using admin signup key.</p>

          {error ? <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="mt-3 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <input className="h-11 w-full rounded border border-slate-200 px-3 text-sm" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="h-11 w-full rounded border border-slate-200 px-3 text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="h-11 w-full rounded border border-slate-200 px-3 text-sm" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className="h-11 w-full rounded border border-slate-200 px-3 text-sm" type="password" placeholder="Confirm password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
            <input className="h-11 w-full rounded border border-slate-200 px-3 text-sm" placeholder="Admin signup key" value={adminSignupKey} onChange={(e) => setAdminSignupKey(e.target.value)} required />
            <button disabled={loading} className="h-11 w-full rounded-full bg-[#1e2756] text-sm font-semibold text-white disabled:opacity-70">
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have admin account? <Link to="/admin" className="text-[#2f87d6] hover:underline">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminSignupPage;
