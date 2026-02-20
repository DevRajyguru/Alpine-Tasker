import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function navClass(isActive) {
  return isActive
    ? "text-green-600 border-b-2 border-green-600 pb-1"
    : "hover:text-slate-900 transition";
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("alpine_token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("alpine_user") || "null");
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.removeItem("alpine_token");
    localStorage.removeItem("alpine_user");
    window.location.href = "/login";
  };

  return (
    <nav className="py-5 px-6 lg:px-12 top-0 z-50 bg-white">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.svg" alt="Alpine Tasker" className="h-9 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-10 text-slate-600 font-medium">
          <li>
            <NavLink to="/" className={({ isActive }) => navClass(isActive)} end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => navClass(isActive)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => navClass(isActive)}>
              Service
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={({ isActive }) => navClass(isActive)}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => navClass(isActive)}>
              Contact
            </NavLink>
          </li>
          {user?.role === "customer" ? (
            <li>
              <NavLink to="/customer/tasks" className={({ isActive }) => navClass(isActive)}>
                My Tasks
              </NavLink>
            </li>
          ) : null}
          {user?.role === "customer" ? (
            <li>
              <NavLink to="/customer/dynamic-task" className={({ isActive }) => navClass(isActive)}>
                Dynamic Task
              </NavLink>
            </li>
          ) : null}
          {user?.role === "admin" ? (
            <li>
              <NavLink to="/admin/service-builder" className={({ isActive }) => navClass(isActive)}>
                Service Builder
              </NavLink>
            </li>
          ) : null}
          {token ? (
            <li>
              <NavLink to="/disputes" className={({ isActive }) => navClass(isActive)}>
                Disputes
              </NavLink>
            </li>
          ) : null}
          {!token ? (
            <li>
              <NavLink to="/login" className={({ isActive }) => navClass(isActive)}>
                Login
              </NavLink>
            </li>
          ) : null}
        </ul>

        <div className="hidden lg:block">
          {!token ? (
            <NavLink to="/register" className="bg-[#1e2756] text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Become A Tasker</span>
            </NavLink>
          ) : (
            <button onClick={logout} className="bg-[#1e2756] text-white px-6 py-2.5 rounded-full hover:bg-opacity-90 transition shadow-md">
              Logout
            </button>
          )}
        </div>

        <button onClick={() => setMobileOpen((v) => !v)} className="lg:hidden text-slate-600 focus:outline-none" aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12M4 18h8" />
          </svg>
        </button>
      </div>

      <div className={`${mobileOpen ? "block" : "hidden"} lg:hidden mt-4 bg-white border-t border-gray-100 animate-fade-in`}>
        <ul className="flex flex-col space-y-4 py-4 text-slate-600 font-medium">
          <li><NavLink onClick={() => setMobileOpen(false)} to="/" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Home</NavLink></li>
          <li><NavLink onClick={() => setMobileOpen(false)} to="/about" className={({ isActive }) => (isActive ? "text-green-600" : "")}>About</NavLink></li>
          <li>
            <NavLink onClick={() => setMobileOpen(false)} to="/services" className={({ isActive }) => (isActive ? "text-green-600" : "")}>
              Service
            </NavLink>
          </li>
          <li><NavLink onClick={() => setMobileOpen(false)} to="/blog" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Blog</NavLink></li>
          <li><NavLink onClick={() => setMobileOpen(false)} to="/contact" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Contact</NavLink></li>
          {user?.role === "customer" ? (
            <li><NavLink onClick={() => setMobileOpen(false)} to="/customer/tasks" className={({ isActive }) => (isActive ? "text-green-600" : "")}>My Tasks</NavLink></li>
          ) : null}
          {user?.role === "customer" ? (
            <li><NavLink onClick={() => setMobileOpen(false)} to="/customer/dynamic-task" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Dynamic Task</NavLink></li>
          ) : null}
          {user?.role === "admin" ? (
            <li><NavLink onClick={() => setMobileOpen(false)} to="/admin/service-builder" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Service Builder</NavLink></li>
          ) : null}
          {token ? (
            <li><NavLink onClick={() => setMobileOpen(false)} to="/disputes" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Disputes</NavLink></li>
          ) : null}
          {!token ? (
            <>
              <li><NavLink onClick={() => setMobileOpen(false)} to="/login" className={({ isActive }) => (isActive ? "text-green-600" : "")}>Login</NavLink></li>
              <li>
                <NavLink onClick={() => setMobileOpen(false)} to="/register" className="inline-block bg-[#1e2756] text-white px-6 py-2 rounded-full w-full text-center">
                  Become A Tasker
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="inline-block bg-[#1e2756] text-white px-6 py-2 rounded-full w-full text-center"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
