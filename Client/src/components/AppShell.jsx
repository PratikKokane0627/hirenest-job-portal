import { BriefcaseBusiness, LayoutDashboard, LogIn, UserCircle, UserPlus } from "lucide-react";
import React from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Jobs from "../pages/Jobs.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/Profile.jsx";
import Register from "../pages/Register.jsx";
import { useAuth } from "../state/AuthContext.jsx";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell d-lg-grid min-vh-100">
      <aside className="sidebar text-white p-3 p-lg-4">
        <NavLink className="brand d-flex align-items-center gap-3 mb-3 mb-lg-4 text-white text-decoration-none" to="/">
          <BriefcaseBusiness size={28} />
          <div>
            <strong className="d-block">HireNest</strong>
            <span className="d-block small text-white-50">MERN recruitment system</span>
          </div>
        </NavLink>

        <nav className="nav nav-pills flex-lg-column gap-2">
          <NavLink className="nav-link" to="/dashboard">
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/jobs">
            <BriefcaseBusiness size={18} /> Jobs
          </NavLink>
          {user?.role === "student" && (
            <NavLink className="nav-link" to="/profile">
              <UserCircle size={18} /> Profile
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink className="nav-link" to="/login">
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink className="nav-link" to="/register">
                <UserPlus size={18} /> Register
              </NavLink>
            </>
          )}
        </nav>

        {user && (
          <button className="btn btn-outline-light mt-3 w-100" onClick={handleLogout}>
            Logout {user.name}
          </button>
        )}
      </aside>

      <main className="content p-3 p-md-4">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
