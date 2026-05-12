import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import loginIllustration from "../assets/login-illustration-900.jpg";
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
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
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <input className="auth-hidden-input" type="text" name="fake-user-email" autoComplete="username" tabIndex="-1" aria-hidden="true" />
        <input className="auth-hidden-input" type="password" name="fake-user-password" autoComplete="current-password" tabIndex="-1" aria-hidden="true" />

        <div className="login-auth-heading">
          <div className="auth-design-icon"><User size={30} /></div>
          <span>HireNest</span>
          <h1>Welcome back</h1>
          <p>Find your dream career faster</p>
        </div>

        <div className="auth-divider" />

        <div className="social-login-grid" aria-label="Social login options">
          <button type="button"><span className="google-mark">G</span> Google</button>
          <button type="button"><span className="brand-mark">in</span> LinkedIn</button>
          <button type="button"><span className="brand-mark">GH</span> GitHub</button>
        </div>

        <div className="auth-text-divider"><span>OR CONTINUE WITH</span></div>

        <div className="auth-design-fields">
          <div className="field">
            <span className="floating-field-label">Email address</span>
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
            <span className="floating-field-label">Password</span>
            <AuthInput icon={Lock}>
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                onFocus={() => setAllowInput(true)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="new-password"
                name="portal-secret-field"
                readOnly={!allowInput}
              />
              <button
                className="auth-eye-button"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </AuthInput>
          </div>
        </div>

        <div className="login-meta-row">
          <label><input type="checkbox" /> Remember me</label>
          <Link to="/login">Forgot Password?</Link>
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
        <img
          src={loginIllustration}
          alt="Students discovering opportunities through the job portal"
          loading="lazy"
          decoding="async"
        />
      </aside>
    </section>
  );
}
