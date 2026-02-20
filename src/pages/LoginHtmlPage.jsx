import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function LoginHtmlPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Enter email first to receive OTP.");
      return;
    }
    setOtpSending(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/otp/send", {
        email,
        purpose: "login",
      });
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!email.trim()) {
      setError("Enter email first.");
      return;
    }
    if (!otp.trim()) {
      setError("Enter OTP first.");
      return;
    }
    setOtpVerifying(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/otp/verify", {
        email,
        purpose: "login",
        otp,
      });
      setSuccess("OTP verified. You can login now.");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        device_name: "web-ui",
      });

      localStorage.setItem("alpine_token", response.data.token);
      localStorage.setItem("alpine_user", JSON.stringify(response.data.user));
      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        if (response?.data?.user?.role === "customer") {
          navigate("/customer/tasks");
        } else if (response?.data?.user?.role === "tasker") {
          navigate("/tasker/dashboard");
        } else if (response?.data?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 600);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3f6] text-slate-900">
      <nav className="top-0 z-50 bg-white px-6 py-5 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.svg" alt="Alpine Tasker" className="h-9 w-auto" />
          </Link>

          <ul className="hidden items-center gap-10 font-medium text-slate-600 lg:flex">
            <li><Link to="/" className="transition hover:text-slate-900">Home</Link></li>
            <li><Link to="/about" className="transition hover:text-slate-900">About</Link></li>
            <li><Link to="/services" className="transition hover:text-slate-900">Service</Link></li>
            <li><Link to="/blog" className="transition hover:text-slate-900">Blog</Link></li>
            <li><Link to="/contactus" className="transition hover:text-slate-900">Contact</Link></li>
            <li><Link to="/login" className="border-b-2 border-[#59b847] pb-1 text-[#59b847]">Login</Link></li>
          </ul>

          <div className="hidden lg:block">
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-[#1e2756] px-6 py-2.5 text-white shadow-md transition hover:bg-opacity-90">
              <i className="fa-regular fa-user"></i>
              <span>Become A Tasker</span>
            </Link>
          </div>

          <button type="button" className="text-slate-600 focus:outline-none lg:hidden" aria-label="Open menu" onClick={() => setMobileMenuOpen((v) => !v)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h8" />
            </svg>
          </button>
        </div>

        <div className={`${mobileMenuOpen ? "block" : "hidden"} mt-4 border-t border-gray-100 bg-white lg:hidden`}>
          <ul className="flex flex-col space-y-4 py-4 font-medium text-slate-600">
            <li><NavLink to="/" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Home</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>About</NavLink></li>
            <li><NavLink to="/services" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Service</NavLink></li>
            <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Blog</NavLink></li>
            <li><NavLink to="/contactus" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => (isActive ? "text-[#59b847]" : "")}>Login</NavLink></li>
            <li>
              <Link to="/register" className="inline-block w-full rounded-full bg-[#1e2756] px-6 py-2 text-center text-white">
                Become A Tasker
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="py-14">
        <section className="mx-auto max-w-7xl px-6">
          <div className="rounded-xl border border-[#dce2ea] bg-white p-4 shadow-sm md:p-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-3 md:p-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#2f87d6]">Log in</h1>
                <p className="mt-2 text-lg sm:text-xl text-[#1f2d6e]">Welcome To Alpine Tasker</p>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  {error ? (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                  ) : null}
                  {success ? (
                    <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>
                  ) : null}

                  <div>
                    <label className="block text-lg sm:text-xl font-semibold text-[#1f2d6e]">Email* *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="mt-2 h-12 w-full rounded-lg bg-[#f3f5f8] px-4 text-base text-[#1f2d6e] outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#2f87d6]"
                    />
                  </div>

                  <div>
                    <label className="block text-lg sm:text-xl font-semibold text-[#1f2d6e]">Password* *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      className="mt-2 h-12 w-full rounded-lg bg-[#f3f5f8] px-4 text-base text-[#1f2d6e] outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#2f87d6]"
                    />
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-[#1f2d6e]">Email OTP Verification</p>
                    <p className="mt-1 text-xs text-slate-500">Use this if login asks for email verification.</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="h-11 rounded-lg bg-[#f3f5f8] px-4 text-base text-[#1f2d6e] outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#2f87d6] sm:col-span-1"
                      />
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpSending}
                        className="h-11 rounded-full bg-[#1e2756] px-4 text-sm font-semibold text-white hover:bg-[#19204a] disabled:opacity-70"
                      >
                        {otpSending ? "Sending..." : "Send OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={verifyOtp}
                        disabled={otpVerifying}
                        className="h-11 rounded-full bg-[#1e2756] px-4 text-sm font-semibold text-white hover:bg-[#19204a] disabled:opacity-70"
                      >
                        {otpVerifying ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-slate-500">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                      <span>Remember Me</span>
                    </label>
                    <a href="signup" className="text-[#2f87d6] hover:underline">Forgot Password?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-full bg-[#1e2756] text-base font-semibold text-white hover:bg-[#19204a] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#dfe5ee]"></div>
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-[#dfe5ee]"></div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button type="button" className="h-10 w-10 rounded-full bg-[#eef3fb] text-[#1f2d6e]"><i className="fa-brands fa-google"></i></button>
                  <button type="button" className="h-10 w-10 rounded-full bg-[#eef3fb] text-[#1f2d6e]"><i className="fa-brands fa-facebook-f"></i></button>
                  <button type="button" className="h-10 w-10 rounded-full bg-[#eef3fb] text-[#1f2d6e]"><i className="fa-brands fa-linkedin-in"></i></button>
                </div>

                <p className="mt-5 text-center text-sm text-slate-400">
                  Don&apos;t have an account? <Link to="/signup" className="text-slate-500 hover:text-[#2f87d6]">Create Account</Link>
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#dce2ea]">
                <img src="/images/login.svg" alt="Login" className="h-full min-h-[260px] sm:min-h-[420px] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-20 overflow-hidden bg-[#1e2b78] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-40 -left-20 h-[420px] w-[720px] rotate-[28deg] bg-[#172a6a]/80"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <Link to="/" className="inline-block">
                <img src="/images/logo.svg" alt="Alpine Tasker" className="h-10 w-auto rounded" />
              </Link>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-linkedin-in text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><i className="fa-brands fa-instagram text-lg"></i></a>
              </div>
            </div>

            <div><h4 className="text-2xl font-semibold">Discover</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Post a task</a></li><li><a href="#">Browse tasks</a></li><li><a href="#">All Service</a></li><li><a href="#">Help</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Company</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">About us</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact us</a></li><li><a href="#">Blog</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Solutions</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Compliance</a></li><li><a href="#">Payments</a></li><li><a href="#">For Finance Teams</a></li><li><a href="#">For Legal Teams</a></li><li><a href="#">For Hiring Managers</a></li></ul></div>
            <div><h4 className="text-2xl font-semibold">Popular Location</h4><ul className="mt-4 space-y-2 text-lg text-white/90"><li><a href="#">Sydney</a></li><li><a href="#">Melbourne</a></li><li><a href="#">Brisbane</a></li><li><a href="#">Perth</a></li><li><a href="#">Adelaide</a></li></ul></div>
          </div>

          <div className="mt-10 flex items-center gap-2 text-lg text-white/90"><i className="fa-solid fa-globe"></i><span>English</span></div>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/20 pt-5 text-base text-white/90 sm:flex-row sm:items-center">
            <p>© Copyright 2026. All Rights Reserved.</p>
            <div className="flex items-center gap-6"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginHtmlPage;
