import React, { useEffect, useState } from "react";
import { Eye, Lock, LogIn, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginIllustration from "../assets/login-illustration.png";
import { useAuth } from "../state/AuthContext.jsx";
import { toastError, toastSuccess, toastWarning } from "../utils/toast.js";

function AuthInput({ icon: Icon, children }) {
  return (
    <label className="auth-design-input">
      <span><Icon size={18} /></span>
      {children}
    </label>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [allowInput, setAllowInput] = useState(false);

  useEffect(() => {
    setForm({ email: "", password: "" });
    const clearSavedFields = window.setTimeout(() => {
      setForm({ email: "", password: "" });
    }, 100);

    return () => window.clearTimeout(clearSavedFields);
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      const message = "Email and password are required.";
      setError(message);
      toastWarning(message, "Missing Details");
      return;
    }

    try {
      await login(form.email.trim(), form.password);
      toastSuccess("Login successful.");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toastError(message);
    }
  }

  return (
    <section className="auth-design-page login-auth-page">
      <form className="auth-design-card login-design-card" onSubmit={submit} autoComplete="off">
        <input className="auth-hidden-input" type="text" name="fake-user-email" autoComplete="username" tabIndex="-1" aria-hidden="true" />
        <input className="auth-hidden-input" type="password" name="fake-user-password" autoComplete="current-password" tabIndex="-1" aria-hidden="true" />

        <div className="login-auth-heading">
          <div className="auth-design-icon"><User size={30} /></div>
          <h1>Welcome back</h1>
          <p>Sign in to continue hiring or applying</p>
        </div>

        <div className="auth-divider" />

        <div className="auth-design-fields">
          <div className="field">
            <span>Email address</span>
            <AuthInput icon={Mail}>
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                onFocus={() => setAllowInput(true)}
                placeholder="Enter your email"
                autoComplete="new-password"
                name="portal-email-field"
                readOnly={!allowInput}
              />
            </AuthInput>
          </div>

          <div className="field">
            <span>Password</span>
            <AuthInput icon={Lock}>
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                onFocus={() => setAllowInput(true)}
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                name="portal-secret-field"
                readOnly={!allowInput}
              />
              <Eye size={17} className="auth-trailing-icon" />
            </AuthInput>
          </div>
        </div>

        {error && <p className="text-danger mb-0">{error}</p>}

        <button className="auth-gradient-button" type="submit">
          <LogIn size={19} /> Login
        </button>

        <p className="auth-switch-text">
          New here? <Link to="/register">Create account</Link>
        </p>
      </form>

      <aside className="register-visual-panel image-panel login-image-panel">
        <img src={loginIllustration} alt="Students discovering opportunities through the job portal" />
      </aside>
    </section>
  );
}
