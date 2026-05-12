import { BriefcaseBusiness, LayoutDashboard, LogIn, LogOut, Menu, UserCircle, UserPlus, X } from "lucide-react";
import React, { lazy, Suspense, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Jobs = lazy(() => import("../pages/Jobs.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const roleLabel = user?.role === "hr" ? "HR / Recruiter" : user?.role === "admin" ? "Admin" : "Student";

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className={menuOpen ? "app-shell d-lg-grid min-vh-100 menu-open" : "app-shell d-lg-grid min-vh-100"}>
      <header className="mobile-app-header">
        <NavLink className="brand mobile-brand text-white text-decoration-none" to="/" onClick={closeMenu}>
          <BriefcaseBusiness size={28} />
          <div>
            <strong>HireNest</strong>
            <span>MERN recruitment system</span>
          </div>
        </NavLink>
        <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={30} />
        </button>
      </header>

      <button className="mobile-menu-backdrop" type="button" aria-label="Close menu" onClick={closeMenu} />

      <aside className={menuOpen ? "sidebar text-white p-3 p-lg-4 open" : "sidebar text-white p-3 p-lg-4"}>
        <div className="mobile-drawer-top">
          <button className="mobile-menu-close" type="button" onClick={closeMenu} aria-label="Close menu">
            <X size={30} />
          </button>
        </div>

        <NavLink className="brand d-flex align-items-center gap-3 mb-3 mb-lg-4 text-white text-decoration-none" to="/" onClick={closeMenu}>
          <BriefcaseBusiness size={28} />
          <div>
            <strong className="d-block">HireNest</strong>
            <span className="d-block small text-white-50">MERN recruitment system</span>
          </div>
        </NavLink>

        {user && (
          <div className="student-sidebar-card">
            <div className="student-sidebar-avatar" aria-hidden="true">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" />
              ) : (
                <UserCircle size={36} />
              )}
            </div>
            <strong>{user.name}</strong>
            <span>{roleLabel}</span>
          </div>
        )}

        <nav className="nav nav-pills flex-lg-column gap-2">
          <NavLink className="nav-link" to="/dashboard" onClick={closeMenu}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/jobs" onClick={closeMenu}>
            <BriefcaseBusiness size={18} /> Jobs
          </NavLink>
          {user?.role === "student" && (
            <NavLink className="nav-link" to="/profile" onClick={closeMenu}>
              <UserCircle size={18} /> Profile
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink className="nav-link" to="/login" onClick={closeMenu}>
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink className="nav-link" to="/register" onClick={closeMenu}>
                <UserPlus size={18} /> Register
              </NavLink>
            </>
          )}
        </nav>

        {user && (
          <button className="btn btn-outline-light mt-3 w-100 sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        )}
      </aside>

      <main className="content p-3 p-md-4">
        <Suspense fallback={<div className="route-loader">Loading...</div>}>
          <Routes>
            <Route path=".well-known/change-password" element={<Navigate to="/dashboard" replace />} />
            <Route path="change-password" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
