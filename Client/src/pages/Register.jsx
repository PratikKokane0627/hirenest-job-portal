import { useState } from "react";
import { BriefcaseBusiness, Building2, Check, Eye, EyeOff, GraduationCap, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import registrationIllustration from "../assets/registration-illustration-900.jpg";
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

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    companyName: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordScore = [
    form.password.length >= 8,
    /[A-Z]/.test(form.password),
    /\d/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password)
  ].filter(Boolean).length;
  const passwordStrengthLabel = ["Too short", "Getting started", "Good", "Strong", "Excellent"][passwordScore];

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      const message = "Name, email, and password are required.";
      setError(message);
      toastWarning(message, "Missing Details");
      return;
    }

    if (form.password !== form.confirmPassword) {
      const message = "Password and confirm password must match.";
      setError(message);
      toastWarning(message, "Password Mismatch");
      return;
    }

    if (form.role === "hr" && !form.companyName) {
      const message = "Company name is required for HR registration.";
      setError(message);
      toastWarning(message, "Company Required");
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        companyName: form.companyName
      });
      toastSuccess(form.role === "hr" ? "HR account created. Wait for admin approval." : "Student account created.");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      if (err.response?.status === 409) {
        toastWarning(message, "Already Registered");
      } else {
        toastError(message);
      }
    }
  }

  return (
    <section className="auth-design-page register-auth-page">
      <form className="auth-design-card register-design-card" onSubmit={submit}>
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="auth-design-heading">
          <div className="auth-design-icon"><UserPlus size={30} /></div>
          <div>
            <span>HireNest</span>
            <h1>Create your portal account</h1>
            <p>Find your dream career faster</p>
          </div>
        </div>

        <div className="auth-divider" />

        <div className="role-selector">
          <span>I am a</span>
          <div className="role-options">
            <button className={form.role === "student" ? "role-option active" : "role-option"} type="button" onClick={() => setForm({ ...form, role: "student" })}>
              <GraduationCap size={18} /> Student
            </button>
            <button className={form.role === "hr" ? "role-option active" : "role-option"} type="button" onClick={() => setForm({ ...form, role: "hr" })}>
              <BriefcaseBusiness size={18} /> HR / Recruiter
            </button>
          </div>
        </div>

        <div className="auth-design-fields">
          <div className="field">
            <span className="floating-field-label">Full name</span>
            <AuthInput icon={User}>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter your name" />
            </AuthInput>
          </div>
          <div className="field">
            <span className="floating-field-label">Email address</span>
            <AuthInput icon={Mail}>
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter your email" />
            </AuthInput>
          </div>
          <div className="field">
            <span className="floating-field-label">Password</span>
            <AuthInput icon={Lock}>
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type={showPassword ? "text" : "password"} placeholder="Create a password" />
              <button className="auth-eye-button" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </AuthInput>
            <div className={`password-strength strength-${passwordScore}`}>
              <span><i style={{ width: `${Math.max(passwordScore, 1) * 25}%` }} /></span>
              <small>{passwordStrengthLabel}</small>
            </div>
          </div>
          <div className="field">
            <span className="floating-field-label">Confirm password</span>
            <AuthInput icon={Lock}>
              <input value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" />
              <button className="auth-eye-button" type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </AuthInput>
          </div>
          {form.role === "hr" && (
            <div className="field animated-company-field">
              <span className="floating-field-label">Company name</span>
              <AuthInput icon={Building2}>
                <input value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} placeholder="Company Name" />
              </AuthInput>
            </div>
          )}
        </div>

        <label className="auth-agreement">
          <input type="checkbox" />
          <span><Check size={15} /> I agree to the terms & conditions</span>
        </label>

        {error && <p className="text-danger mb-0">{error}</p>}

        <button className="auth-gradient-button" type="submit">
          <UserPlus size={19} /> Register Account
        </button>

        <div className="auth-divider" />

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>

      <aside className="register-visual-panel image-panel">
        <img
          src={registrationIllustration}
          alt="Students and recruiters connecting through the job portal"
          loading="lazy"
          decoding="async"
        />
      </aside>
    </section>
  );
}
