import React, { useState } from "react";
import { BriefcaseBusiness, Building2, Eye, GraduationCap, Lock, Mail, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import registrationIllustration from "../assets/registration-illustration.png";
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
        <div className="auth-design-heading">
          <div className="auth-design-icon"><UserPlus size={30} /></div>
          <div>
            <h1>Create your portal account</h1>
            <p>Join thousands of students and recruiters building the future together.</p>
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
          <AuthInput icon={User}>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full Name" />
          </AuthInput>
          <AuthInput icon={Mail}>
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email Address" />
          </AuthInput>
          <AuthInput icon={Lock}>
            <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" placeholder="Password" />
            <Eye size={17} className="auth-trailing-icon" />
          </AuthInput>
          <AuthInput icon={Lock}>
            <input value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} type="password" placeholder="Confirm Password" />
            <Eye size={17} className="auth-trailing-icon" />
          </AuthInput>
          <AuthInput icon={Building2}>
            <input value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} placeholder="Company Name (for HR only)" disabled={form.role !== "hr"} />
          </AuthInput>
        </div>

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
        <img src={registrationIllustration} alt="Students and recruiters connecting through the job portal" />
      </aside>
    </section>
  );
}
