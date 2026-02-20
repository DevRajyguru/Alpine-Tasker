import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function DashboardIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 3l8 4v5c0 5.5-3.8 8.4-8 9-4.2-.6-8-3.5-8-9V7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2" />
      <path d="M15 19a4 4 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

function TicketIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 1 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M21 14a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M4 19V5M10 19v-9M16 19v-5M22 19H2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M15 17H5l1.6-1.6A2 2 0 0 0 7 14V10a5 5 0 1 1 10 0v4a2 2 0 0 0 .4 1.4L19 17h-4zM10 20a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function LogoutIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("alpine_token");
    const locked = localStorage.getItem("alpine_admin_locked");
    if (locked === "1") {
      navigate("/admin/lock");
      return;
    }
    if (!token || user?.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate, user?.role]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("alpine_token");
      localStorage.removeItem("alpine_user");
      localStorage.removeItem("alpine_admin_locked");
      navigate("/admin");
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
      return;
    }
    setSidebarCollapsed((prev) => !prev);
  };

  const lockScreen = () => {
    localStorage.setItem("alpine_admin_locked", "1");
    setProfileOpen(false);
    navigate("/admin/lock");
  };

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { to: "/admin/users", label: "Users", icon: <UsersIcon /> },
    { to: "/admin/taskers", label: "Taskers", icon: <UsersIcon /> },
    { to: "/admin/service-builder", label: "Service Builder", icon: <ToolIcon /> },
    { to: "/admin/background-checks", label: "Background Checks", icon: <ShieldIcon /> },
    { to: "/admin/coupons", label: "Coupons", icon: <TicketIcon /> },
    { to: "/admin/transactions", label: "Transactions", icon: <CardIcon /> },
    { to: "/admin/commissions", label: "Commissions", icon: <ChartIcon /> },
    { to: "/admin/disputes", label: "Disputes", icon: <MessageIcon /> },
    { to: "/admin/earnings", label: "Earnings", icon: <ChartIcon /> },
  ];

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      isActive ? "bg-[#2f87d6] text-white shadow-sm" : "bg-white/10 text-indigo-100 hover:bg-white/20"
    }`;

  return (
    <div className="min-h-screen bg-[#eef3fb] p-0">
      <div className="mx-auto flex min-h-screen w-full overflow-hidden border border-slate-200 bg-white shadow-none">
        {sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-[#0f1f4a]/45 lg:hidden"
            aria-label="Close sidebar overlay"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 bg-[linear-gradient(180deg,#112457_0%,#1b2f74_48%,#24439f_100%)] p-5 text-white transition-all duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "w-[96px]" : "w-[270px]"}`}
        >
          <div className={`mb-6 ${sidebarCollapsed ? "text-center" : ""}`}>
            <img
              src="/images/logo.svg"
              alt="Alpine Tasker"
              className={`mx-auto rounded-lg object-contain ${sidebarCollapsed ? "h-8 w-auto" : "h-10 w-60"}`}
            />
          </div>
          <p className={`mb-2 text-[11px] uppercase tracking-[0.24em] text-indigo-200 ${sidebarCollapsed ? "text-center" : ""}`}>Menu</p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={itemClass} onClick={() => setSidebarOpen(false)}>
                <span className="shrink-0">{item.icon}</span>
                {sidebarCollapsed ? null : <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 bg-[#f1f5ff] p-3 md:p-5">
          <header className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="rounded-xl border border-slate-200 bg-[#f7f9ff] p-2 text-slate-600 hover:bg-[#eef3ff]"
                >
                  <MenuIcon />
                </button>
                <div className="hidden sm:block">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="h-10 w-[260px] rounded-xl border border-slate-200 bg-[#f7f9ff] px-3 text-sm text-slate-700 outline-none focus:border-[#2f87d6]"
                  />
                </div>
              </div>

              <div className="relative flex items-center gap-2 text-slate-600">
                <button type="button" className="rounded-lg p-2 hover:bg-slate-100">
                  <BellIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2756] text-xs font-bold text-white">
                    {(user?.name || "A").slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{user?.name || "Admin"}</span>
                  <ChevronDownIcon className="h-4 w-4 text-slate-500" />
                </button>

                {profileOpen ? (
                  <div className="absolute right-0 top-12 z-20 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                    <p className="px-3 py-2 text-sm font-semibold text-slate-800">Welcome!</p>
                    <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <UserIcon /> My Account
                    </button>
                    <button type="button" onClick={lockScreen} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <LockIcon /> Lock Screen
                    </button>
                    <hr className="my-2 border-slate-200" />
                    <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <LogoutIcon /> Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
