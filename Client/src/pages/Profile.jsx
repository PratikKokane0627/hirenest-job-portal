import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, GraduationCap, Link, Mail, MapPin, Phone, Save, Sparkles, User } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";
import { toastError, toastSuccess, toastWarning } from "../utils/toast.js";

function Field({ label, icon: Icon, children }) {
  return (
    <label className="field">
      <span className="form-label mb-0 d-flex align-items-center gap-2">
        <Icon size={16} /> {label}
      </span>
      {children}
    </label>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    skills: user?.studentProfile?.skills?.join(", ") || "",
    experience: user?.studentProfile?.experience || "",
    degree: user?.studentProfile?.degree || "",
    college: user?.studentProfile?.college || "",
    passingYear: user?.studentProfile?.passingYear || "",
    cgpa: user?.studentProfile?.cgpa || "",
    linkedIn: user?.studentProfile?.linkedIn || "",
    github: user?.studentProfile?.github || "",
    portfolio: user?.studentProfile?.portfolio || ""
  });

  function fillProfile(nextUser) {
    setProfile({
      name: nextUser?.name || "",
      email: nextUser?.email || "",
      phone: nextUser?.phone || "",
      location: nextUser?.location || "",
      skills: nextUser?.studentProfile?.skills?.join(", ") || "",
      experience: nextUser?.studentProfile?.experience || "",
      degree: nextUser?.studentProfile?.degree || "",
      college: nextUser?.studentProfile?.college || "",
      passingYear: nextUser?.studentProfile?.passingYear || "",
      cgpa: nextUser?.studentProfile?.cgpa || "",
      linkedIn: nextUser?.studentProfile?.linkedIn || "",
      github: nextUser?.studentProfile?.github || "",
      portfolio: nextUser?.studentProfile?.portfolio || ""
    });
  }

  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      setLoading(true);
      try {
        const { data } = await api.get("/auth/me");
        updateUser(data);
        fillProfile(data);
      } catch (error) {
        toastError(error.response?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (!user) {
    return (
      <section>
        <div className="page-title"><p>Login required</p><h1>Profile</h1></div>
        <section className="card border-0 shadow-sm panel"><p className="mb-0">Please login to update your profile.</p></section>
      </section>
    );
  }

  if (user.role !== "student") {
    return (
      <section>
        <div className="page-title"><p>Student only</p><h1>Profile</h1></div>
        <section className="card border-0 shadow-sm panel"><p className="mb-0">Profile editing here is available for students.</p></section>
      </section>
    );
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (!profile.name) {
      toastWarning("Name is required.", "Missing Details");
      return;
    }

    const data = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key !== "email") data.append(key, value);
    });
    if (resume) data.append("resume", resume);

    try {
      const response = await api.patch("/auth/profile", data);
      updateUser(response.data);
      fillProfile(response.data);
      setResume(null);
      toastSuccess("Student profile updated.");
    } catch (error) {
      toastError(error.response?.data?.message || "Could not update profile.");
    }
  }

  return (
    <section>
      <div className="page-title">
        <p>Student profile</p>
        <h1>Update Profile</h1>
      </div>

      <section className="card border-0 shadow-sm panel wide profile-panel">
        {loading && <p className="text-secondary">Loading existing profile data...</p>}
        <form className="profile-form" onSubmit={saveProfile}>
          <div className="profile-section">
            <h2>Personal Details</h2>
            <div className="form-grid">
              <Field label="Full name" icon={User}>
                <input className="form-control" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
              </Field>
              <Field label="Email" icon={Mail}>
                <input className="form-control" value={profile.email} disabled />
              </Field>
              <Field label="Phone" icon={Phone}>
                <input className="form-control" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
              </Field>
              <Field label="Location" icon={MapPin}>
                <input className="form-control" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />
              </Field>
            </div>
          </div>

          <div className="profile-section">
            <h2>Education</h2>
            <div className="form-grid">
              <Field label="Degree" icon={GraduationCap}>
                <input className="form-control" value={profile.degree} onChange={(event) => setProfile({ ...profile, degree: event.target.value })} placeholder="B.Tech, B.Sc, MCA" />
              </Field>
              <Field label="College / University" icon={GraduationCap}>
                <input className="form-control" value={profile.college} onChange={(event) => setProfile({ ...profile, college: event.target.value })} />
              </Field>
              <Field label="Year of passing" icon={GraduationCap}>
                <input className="form-control" value={profile.passingYear} onChange={(event) => setProfile({ ...profile, passingYear: event.target.value })} />
              </Field>
              <Field label="CGPA / Percentage" icon={GraduationCap}>
                <input className="form-control" value={profile.cgpa} onChange={(event) => setProfile({ ...profile, cgpa: event.target.value })} />
              </Field>
            </div>
          </div>

          <div className="profile-section priority-section">
            <h2>Skills</h2>
            <Field label="Skills" icon={Sparkles}>
              <input className="form-control" value={profile.skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} placeholder="JavaScript, Python, React, Communication" />
            </Field>
          </div>

          <div className="profile-section">
            <h2>Experience</h2>
            <Field label="Experience" icon={BriefcaseBusiness}>
              <textarea className="form-control" value={profile.experience} onChange={(event) => setProfile({ ...profile, experience: event.target.value })} />
            </Field>
          </div>

          <div className="profile-section">
            <h2>Resume</h2>
            <Field label="Resume upload" icon={FileText}>
              <input className="form-control" type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0])} />
            </Field>
          </div>

          <div className="profile-section">
            <h2>Social Links</h2>
            <div className="form-grid">
              <Field label="LinkedIn profile" icon={Link}>
                <input className="form-control" value={profile.linkedIn} onChange={(event) => setProfile({ ...profile, linkedIn: event.target.value })} placeholder="https://linkedin.com/in/username" />
              </Field>
              <Field label="GitHub" icon={Link}>
                <input className="form-control" value={profile.github} onChange={(event) => setProfile({ ...profile, github: event.target.value })} placeholder="https://github.com/username" />
              </Field>
              <Field label="Portfolio website" icon={Link}>
                <input className="form-control" value={profile.portfolio} onChange={(event) => setProfile({ ...profile, portfolio: event.target.value })} placeholder="https://yourportfolio.com" />
              </Field>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-success w-100"><Save size={18} /> Save Profile</button>
          </div>
        </form>
      </section>
    </section>
  );
}
