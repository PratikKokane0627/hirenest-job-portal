import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  Link,
  Mail,
  RefreshCw,
  Send,
  ThumbsDown,
  Trash2,
  UserCheck,
  Users
} from "lucide-react";
import { io } from "socket.io-client";
import { api } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";
import { toastError, toastInfo, toastSuccess, toastWarning } from "../utils/toast.js";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

function Field({ label, children, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span className="form-label mb-0">{label}</span>
      {children}
    </label>
  );
}

function Metric({ icon: Icon, label, value, active = false, onClick }) {
  const className = active ? "card border-0 shadow-sm metric-card active" : "card border-0 shadow-sm metric-card";

  return (
    <button className={className} type="button" onClick={onClick}>
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </button>
  );
}

function Notifications({ user, scrollable = false }) {
  const [items, setItems] = useState([]);
  const unreadCount = items.filter((item) => !item.readAt).length;

  useEffect(() => {
    if (!user) return;
    api.get("/notifications").then(({ data }) => setItems(data)).catch(() => { });
    const socket = io(API_ORIGIN);
    socket.emit("join:user", user._id);
    socket.on("notification:new", (notification) => setItems((current) => [notification, ...current]));
    return () => socket.disconnect();
  }, [user]);

  async function markRead(id) {
    const { data } = await api.patch(`/notifications/${id}/read`);
    setItems((current) => current.map((item) => (item._id === id ? data : item)));
    toastInfo("Notification marked as read.");
  }

  return (
    <section className="card border-0 shadow-sm panel notification-panel">
      <div className="section-toolbar notification-toolbar">
        <div className="section-heading mb-0"><Bell size={19} /><h2>Notifications</h2></div>
        <span className="badge text-bg-primary">{unreadCount} unread</span>
      </div>
      <div className={scrollable ? "stack notification-list dashboard-scroll-list" : "stack notification-list"}>
        {items.length === 0 && <p className="text-secondary mb-0">No notifications yet.</p>}
        {(scrollable ? items : items.slice(0, 6)).map((item) => (
          <article className={item.readAt ? "notification-card read" : "notification-card"} key={item._id}>
            <div className="notification-icon"><Bell size={17} /></div>
            <div className="notification-copy">
              <div className="notification-title-row">
                <strong>{item.title}</strong>
              </div>
              <p>{item.body || "No details available."}</p>
            </div>
            {!item.readAt && <button className="btn btn-sm btn-outline-success" onClick={() => markRead(item._id)}>Mark read</button>}
          </article>
        ))}
      </div>
    </section>
  );
}

function Messages({ draftReceiver = null }) {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ receiver: "", body: "" });

  useEffect(() => {
    api.get("/messages").then(({ data }) => setMessages(data)).catch(() => { });
  }, []);

  useEffect(() => {
    if (draftReceiver?.id) {
      setForm((current) => ({ ...current, receiver: draftReceiver.id }));
    }
  }, [draftReceiver]);

  async function send(event) {
    event.preventDefault();
    if (!form.receiver || !form.body) {
      toastWarning("Receiver and message are required.", "Missing Details");
      return;
    }
    const { data } = await api.post("/messages", form);
    setMessages((current) => [...current, data]);
    setForm({ receiver: "", body: "" });
    toastSuccess("Message sent.");
  }

  return (
    <section className="card border-0 shadow-sm panel">
      <div className="section-heading"><Mail size={19} /><h2>Messaging</h2></div>
      <form className="compact-form" onSubmit={send}>
        <div className="selected-recipient">
          {draftReceiver?.id ? (
            <>
              <strong>{draftReceiver.name || "Selected candidate"}</strong>
              <span>{draftReceiver.email || "Candidate selected from applications"}</span>
            </>
          ) : (
            <span>Select Message on a candidate card to choose a receiver.</span>
          )}
        </div>
        <textarea className="form-control" placeholder="Message" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
        <button className="btn btn-success"><Send size={16} /> Send</button>
      </form>
      <div className="stack mt-3">
        {messages.slice(-4).map((message) => (
          <article className="notice border rounded p-3 bg-light" key={message._id}>
            <div><strong>{message.sender?.name || "You"} to {message.receiver?.name || "User"}</strong><span>{message.body}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentMessages({ user, onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMessage, setOpenMessage] = useState(null);

  function unreadCount(items) {
    return items.filter((message) => message.receiver?._id === user?._id && !message.readAt).length;
  }

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      try {
        const { data } = await api.get("/messages");
        setMessages(data);
        onUnreadChange(unreadCount(data));
      } catch (error) {
        toastError(error.response?.data?.message || "Could not load messages.");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  async function openAndRead(message) {
    setOpenMessage((current) => current === message._id ? null : message._id);

    if (message.receiver?._id !== user?._id || message.readAt) return;

    try {
      const { data } = await api.patch(`/messages/${message._id}/read`);
      setMessages((current) => {
        const nextMessages = current.map((item) => item._id === message._id ? data : item);
        onUnreadChange(unreadCount(nextMessages));
        return nextMessages;
      });
    } catch (error) {
      toastError(error.response?.data?.message || "Could not mark message as read.");
    }
  }

  return (
    <div className="stack student-scroll-list">
      {loading && <p className="text-secondary mb-0">Loading messages...</p>}
      {!loading && messages.length === 0 && <p className="text-secondary mb-0">No messages yet.</p>}
      {messages.map((message) => (
        <article className={openMessage === message._id ? "notification-card message-card open" : "notification-card message-card"} key={message._id}>
          <div className="notification-icon"><Mail size={17} /></div>
          <div className="notification-copy">
            <div className="notification-title-row">
              <strong>{message.sender?.name || "Sender"}</strong>
              <span>{message.sender?.role || "message"}</span>
            </div>
            <p>{openMessage === message._id ? "Message opened below." : "Click View to read message."}</p>
          </div>
          <button className="btn btn-sm btn-outline-success" type="button" onClick={() => openAndRead(message)}>
            {openMessage === message._id ? "Hide" : "View"}
          </button>
          {openMessage === message._id && (
            <div className="message-detail">
              <strong>Message</strong>
              <p>{message.body}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function StudentDashboard({ user }) {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activePanel, setActivePanel] = useState("applications");
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadStudentData() {
    setLoading(true);
    setLoadError("");
    try {
      const [applicationsResponse, savedJobsResponse, messagesResponse] = await Promise.all([
        api.get("/applications/me"),
        api.get("/jobs/saved"),
        api.get("/messages")
      ]);
      setApplications(applicationsResponse.data);
      setSavedJobs(savedJobsResponse.data.filter((job) => job && job.status === "active"));
      const messages = messagesResponse.data || [];
      setUnreadMessages(messages.filter((message) => message.receiver?._id === user?._id && !message.readAt).length);
    } catch (error) {
      setLoadError(error.response?.data?.message || "Could not load student dashboard data.");
      toastError(error.response?.data?.message || "Could not load student dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudentData();
  }, []);

  return (
    <div className="student-dashboard">
      <div className="metrics-grid dashboard-section">
        <Metric icon={ClipboardList} label="Applications" value={applications.length} active={activePanel === "applications"} onClick={() => setActivePanel("applications")} />
        <Metric icon={Bookmark} label="Saved Jobs" value={savedJobs.length} active={activePanel === "saved"} onClick={() => setActivePanel("saved")} />
        <Metric icon={Mail} label="Messages" value={unreadMessages} active={activePanel === "messages"} onClick={() => setActivePanel("messages")} />
        <Metric icon={CheckCircle2} label="Notifications" value="Live" active={activePanel === "notifications"} onClick={() => setActivePanel("notifications")} />
      </div>
      <div className="dashboard-grid dashboard-section">
        <section className="card border-0 shadow-sm panel wide">
          <div className="section-toolbar">
            <h2>{activePanel === "applications" ? "Application Tracking" : activePanel === "saved" ? "Saved Jobs" : activePanel === "messages" ? "Messages" : "Notifications"}</h2>
            <button className="btn btn-sm btn-outline-success" type="button" onClick={loadStudentData}><RefreshCw size={15} /> Refresh</button>
          </div>

          {loading && <p className="text-secondary mb-0">Loading dashboard data...</p>}
          {loadError && <p className="text-danger mb-0">{loadError}</p>}

          {!loading && !loadError && activePanel === "applications" && (
            <div className="stack student-scroll-list">
              {applications.length === 0 && <p className="text-secondary mb-0">No applications submitted yet. Apply from the Jobs page.</p>}
              {applications.map((item) => (
                <article className="row-card border rounded p-3 bg-light" key={item._id}>
                  <div>
                    <strong>{item.job?.title || "Job removed"}</strong>
                    <span>{item.job?.company || "Company unavailable"}</span>
                    {expandedApplication === item._id && (
                      <div className="application-status-detail">
                        <span>Status: {item.status}</span>
                        {item.interview?.scheduledAt && <span>Interview: {new Date(item.interview.scheduledAt).toLocaleString()} - {item.interview.mode}</span>}
                        {item.interview?.link && <span>Link/Venue: {item.interview.link}</span>}
                        {item.interview?.notes && <span>Notes: {item.interview.notes}</span>}
                        {item.offerLetter?.body && <pre>{item.offerLetter.body}</pre>}
                      </div>
                    )}
                  </div>
                  <button className="btn btn-sm btn-outline-success" type="button" onClick={() => setExpandedApplication((current) => current === item._id ? null : item._id)}>
                    {expandedApplication === item._id ? "Hide Status" : item.status}
                  </button>
                </article>
              ))}
            </div>
          )}

          {!loading && !loadError && activePanel === "saved" && (
            <div className="stack student-scroll-list">
              {savedJobs.length === 0 && <p className="text-secondary mb-0">No saved jobs yet. Click Save on the Jobs page.</p>}
              {savedJobs.map((job) => (
                <article className="row-card border rounded p-3 bg-light" key={job._id}>
                  <div><strong>{job.title}</strong><span>{job.company} - {job.location}</span></div>
                  <span className="badge text-bg-primary">{job.category}</span>
                </article>
              ))}
            </div>
          )}

          {!loading && !loadError && activePanel === "messages" && <StudentMessages user={user} onUnreadChange={setUnreadMessages} />}

          {!loading && !loadError && activePanel === "notifications" && <Notifications user={user} scrollable />}
        </section>
      </div>
    </div>
  );
}

function HrDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("");
  const [activeHrPanel, setActiveHrPanel] = useState("jobs");
  const [openMessageForm, setOpenMessageForm] = useState(null);
  const [candidateMessages, setCandidateMessages] = useState({});
  const [interviewForms, setInterviewForms] = useState({});
  const [offerLetters, setOfferLetters] = useState({});
  const [company, setCompany] = useState({
    companyName: user.companyProfile?.companyName || "",
    website: user.companyProfile?.website || "",
    industry: user.companyProfile?.industry || "",
    description: user.companyProfile?.description || ""
  });
  const [jobForm, setJobForm] = useState({
    title: "",
    company: user.companyProfile?.companyName || "",
    description: "",
    location: "",
    industry: "",
    salary: "",
    category: "Full-time",
    skills: "",
    expiryDate: ""
  });

  function load() {
    api.get("/jobs/mine").then(({ data }) => setJobs(data)).catch(() => { });
    api.get("/applications/hr").then(({ data }) => setApplications(data)).catch(() => { });
  }

  useEffect(load, []);

  async function saveCompany(event) {
    event.preventDefault();
    try {
      await api.patch("/auth/profile", company);
      toastSuccess("Company profile updated.");
    } catch (error) {
      toastError(error.response?.data?.message || "Could not update company profile.");
    }
  }

  async function addJob(event) {
    event.preventDefault();
    const payload = { ...jobForm, skills: jobForm.skills.split(",").map((skill) => skill.trim()).filter(Boolean) };
    if (!payload.expiryDate) delete payload.expiryDate;
    try {
      await api.post("/jobs", payload);
      setJobForm({ ...jobForm, title: "", description: "", location: "", salary: "", skills: "", expiryDate: "" });
      toastSuccess("Job added successfully.");
      load();
    } catch (error) {
      const message = error.response?.data?.message || "Could not add job.";
      if (error.response?.status === 403) {
        toastWarning(message, "Approval Required");
      } else {
        toastError(message);
      }
    }
  }

  async function updateJob(id, patch) {
    try {
      await api.patch(`/jobs/${id}`, patch);
      toastSuccess("Job updated.");
      load();
    } catch (error) {
      const message = error.response?.data?.message || "Could not update job.";
      if (error.response?.status === 403) {
        toastWarning(message, "Not Allowed");
      } else {
        toastError(message);
      }
    }
  }

  async function updateApplication(id, patch) {
    try {
      await api.patch(`/applications/${id}/status`, patch);
      toastSuccess("Application status updated.");
      load();
    } catch (error) {
      const message = error.response?.data?.message || "Could not update application.";
      if (error.response?.status === 404) {
        toastWarning(message, "Not Found");
      } else {
        toastError(message);
      }
    }
  }

  function setInterviewField(id, field, value) {
    setInterviewForms((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value }
    }));
  }

  function generateOfferLetter(application) {
    const body = `Dear ${application.student?.name || "Candidate"},\n\nWe are pleased to offer you the role of ${application.job?.title || "the selected position"} at ${application.job?.company || company.companyName || "our company"}.\n\nYour application has been reviewed and selected by our HR team. Please reply through the portal for further communication.\n\nRegards,\n${company.companyName || user.name}`;
    setOfferLetters((current) => ({
      ...current,
      [application._id]: body
    }));
    toastInfo("Offer letter generated. Review it before sending.");
  }

  async function scheduleInterview(application) {
    const interview = interviewForms[application._id] || {};
    if (!interview.scheduledAt || !interview.mode) {
      toastWarning("Interview date and mode are required.", "Missing Interview Details");
      return;
    }

    await updateApplication(application._id, {
      status: "interview",
      interview
    });
  }

  async function sendOffer(application) {
    const body = offerLetters[application._id];
    if (!body) {
      toastWarning("Generate or enter an offer letter before sending.", "Offer Letter Required");
      return;
    }

    await updateApplication(application._id, {
      status: "offered",
      offerLetter: {
        title: `Offer Letter - ${application.job?.title || "Position"}`,
        body,
        sentAt: new Date()
      },
      offerLetterUrl: "Digital offer letter sent through portal"
    });
  }

  async function sendCandidateMessage(application) {
    const body = candidateMessages[application._id] || "";
    if (!body.trim()) {
      toastWarning("Message cannot be empty.", "Missing Message");
      return;
    }

    try {
      await api.post("/messages", {
        receiver: application.student?._id,
        body
      });
      setCandidateMessages((current) => ({ ...current, [application._id]: "" }));
      setOpenMessageForm(null);
      toastSuccess("Message sent to candidate.");
    } catch (error) {
      toastError(error.response?.data?.message || "Could not send message.");
    }
  }

  function normalizeSearch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function applicationSearchText(item) {
    const profile = item.student?.studentProfile || {};
    return normalizeSearch([
      item.student?.name,
      item.student?.email,
      item.status,
      item.job?.title,
      item.job?.company,
      item.job?.location,
      item.job?.industry,
      item.job?.category,
      item.job?.salary,
      profile.skills?.join(" "),
      profile.softSkills?.join(" "),
      profile.education,
      profile.experience,
      profile.degree,
      profile.college,
      profile.passingYear,
      profile.cgpa,
      profile.internships,
      profile.partTimeJobs,
      profile.freelanceWork,
      profile.role,
      profile.companyName,
      profile.duration,
      profile.responsibilities,
      profile.linkedIn,
      profile.github,
      profile.portfolio,
      profile.resumeUrl
    ].filter(Boolean).join(" "));
  }

  function resumeHref(application) {
    const resumeUrl = application.student?.studentProfile?.resumeUrl || application.resumeUrl;
    if (!resumeUrl) return "";
    if (/^https?:\/\//i.test(resumeUrl)) {
      const cloudinaryUrl = resumeUrl.replace("/image/upload/", "/raw/upload/");
      return `${API_ORIGIN}/api/files/resume?url=${encodeURIComponent(cloudinaryUrl)}`;
    }
    return `${API_ORIGIN}${resumeUrl.startsWith("/") ? resumeUrl : `/${resumeUrl}`}`;
  }

  function normalizeSocialUrl(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function isValidUrl(value) {
    try {
      const url = new URL(normalizeSocialUrl(value));
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function socialIconLink(value, label, Icon) {
    if (!isValidUrl(value)) {
      return (
        <span className="social-icon-link disabled" title={`${label} not added`}>
          <Icon size={18} />
        </span>
      );
    }

    const href = normalizeSocialUrl(value);
    return (
      <a className="social-icon-link" href={href} target="_blank" rel="noreferrer" title={label}>
        <Icon size={18} />
      </a>
    );
  }

  const visibleApplications = applications.filter((item) => {
    const text = applicationSearchText(item);
    const terms = normalizeSearch(filter).split(" ").filter(Boolean);
    return terms.length === 0 || terms.every((term) => text.includes(term));
  });
  const panelApplications = activeHrPanel === "interviews"
    ? visibleApplications.filter((item) => item.status === "interview")
    : visibleApplications;

  return (
    <>
      <div className="metrics-grid dashboard-section">
        <Metric icon={BriefcaseBusiness} label="Posted Jobs" value={jobs.length} active={activeHrPanel === "jobs"} onClick={() => setActiveHrPanel("jobs")} />
        <Metric icon={Users} label="Applications" value={applications.length} active={activeHrPanel === "applications"} onClick={() => setActiveHrPanel("applications")} />
        <Metric icon={CalendarClock} label="Interviews" value={applications.filter((item) => item.status === "interview").length} active={activeHrPanel === "interviews"} onClick={() => setActiveHrPanel("interviews")} />
      </div>
      <div className="dashboard-grid dashboard-section">
        {activeHrPanel === "jobs" && <section className="card border-0 shadow-sm panel">
          <h2>Company Profile</h2>
          <form className="compact-form" onSubmit={saveCompany}>
            <Field label="Company"><input className="form-control" value={company.companyName} onChange={(event) => setCompany({ ...company, companyName: event.target.value })} /></Field>
            <Field label="Website"><input className="form-control" value={company.website} onChange={(event) => setCompany({ ...company, website: event.target.value })} /></Field>
            <Field label="Industry"><input className="form-control" value={company.industry} onChange={(event) => setCompany({ ...company, industry: event.target.value })} /></Field>
            <Field label="Description"><textarea className="form-control" value={company.description} onChange={(event) => setCompany({ ...company, description: event.target.value })} /></Field>
            <button className="btn btn-success">Save Company</button>
          </form>
        </section>}
        {activeHrPanel === "jobs" && <section className="card border-0 shadow-sm panel wide">
          <h2>Add Job</h2>
          <form className="form-grid" onSubmit={addJob}>
            <Field label="Title"><input className="form-control" value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} required /></Field>
            <Field label="Company"><input className="form-control" value={jobForm.company} onChange={(event) => setJobForm({ ...jobForm, company: event.target.value })} required /></Field>
            <Field label="Location"><input className="form-control" value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} required /></Field>
            <Field label="Industry"><input className="form-control" value={jobForm.industry} onChange={(event) => setJobForm({ ...jobForm, industry: event.target.value })} /></Field>
            <Field label="Salary"><input className="form-control" value={jobForm.salary} onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })} /></Field>
            <Field label="Category"><select className="form-select" value={jobForm.category} onChange={(event) => setJobForm({ ...jobForm, category: event.target.value })}><option>Internship</option><option>Part-time</option><option>Full-time</option><option>Freelance</option></select></Field>
            <Field label="Expiry date"><input className="form-control" type="date" value={jobForm.expiryDate} onChange={(event) => setJobForm({ ...jobForm, expiryDate: event.target.value })} /></Field>
            <Field label="Skills"><input className="form-control" value={jobForm.skills} onChange={(event) => setJobForm({ ...jobForm, skills: event.target.value })} /></Field>
            <Field label="Description" className="field-span-2"><textarea className="form-control" value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} required /></Field>
            <div className="form-action add-job-action">
              <button className="btn btn-success">Add Job</button>
            </div>
          </form>
        </section>}
        {activeHrPanel === "jobs" && <section className="card border-0 shadow-sm panel wide">
          <h2>Job Expiry and Renewal</h2>
          <div className="stack dashboard-scroll-list hr-job-renewal-scroll">
            {jobs.map((job) => (
              <article className="row-card border rounded p-3 bg-light" key={job._id}>
                <div><strong>{job.title}</strong><span>{job.category} - {job.status}</span></div>
                <div className="actions"><button className="btn btn-sm btn-outline-success" onClick={() => updateJob(job._id, { status: "active", expiryDate: new Date(Date.now() + 30 * 86400000) })}>Renew</button><button className="btn btn-sm btn-outline-secondary" onClick={() => updateJob(job._id, { status: "closed" })}>Close</button></div>
              </article>
            ))}
          </div>
        </section>}
        {(activeHrPanel === "applications" || activeHrPanel === "interviews") && <section className="card border-0 shadow-sm panel wide">
          <h2>{activeHrPanel === "interviews" ? "Interview Scheduling" : "Candidate Shortlisting and Application Management"}</h2>
          <div className="candidate-search-row">
            <input className="form-control candidate-search" placeholder="Search candidate, skills, qualification, experience, job, company, location, status" value={filter} onChange={(event) => setFilter(event.target.value)} />
            {filter && <button className="btn btn-outline-secondary" type="button" onClick={() => setFilter("")}>Clear</button>}
          </div>
          <p className="candidate-search-count">{panelApplications.length} of {applications.length} applicants shown</p>
          <div className="stack candidate-list-scroll">
            {panelApplications.length === 0 && <p className="text-secondary mb-0">No candidate applications match this filter.</p>}
            {panelApplications.map((item) => (
              <article className="application-card applicant-card border rounded p-3 bg-light" key={item._id}>
                <div className="candidate-info">
                  <div className="candidate-avatar">{item.student?.name?.charAt(0)?.toUpperCase() || "C"}</div>
                  <div>
                    <div className="candidate-heading">
                      <strong>{item.student?.name}</strong>
                      <span className="badge text-bg-primary">{item.status}</span>
                    </div>
                    <span className="candidate-email">{item.student?.email}</span>
                    <span className="candidate-job">{item.job?.title} at {item.job?.company}</span>
                    <div className="candidate-tags">
                      <span>Skills: {item.student?.studentProfile?.skills?.join(", ") || "Not added"}</span>
                      <span>Soft skills: {item.student?.studentProfile?.softSkills?.join(", ") || "Not added"}</span>
                      <span>Degree: {item.student?.studentProfile?.degree || item.student?.studentProfile?.education || "Not added"}</span>
                      <span>College: {item.student?.studentProfile?.college || "Not added"}</span>
                      <span>CGPA/%: {item.student?.studentProfile?.cgpa || "Not added"}</span>
                      <span>Experience: {item.student?.studentProfile?.experience || item.student?.studentProfile?.duration || "Not added"}</span>
                      <span>Resume: {resumeHref(item) ? "Uploaded" : "Not uploaded"}</span>
                    </div>
                    <div className="candidate-status-actions">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => updateApplication(item._id, { status: "shortlisted" })}><UserCheck size={15} /> Shortlist</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => updateApplication(item._id, { status: "rejected" })}><ThumbsDown size={15} /> Reject</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                        setOpenMessageForm((current) => current === item._id ? null : item._id);
                      }}><Mail size={15} /> Message</button>
                      {resumeHref(item) && <a className="btn btn-sm btn-outline-success" href={resumeHref(item)} target="_blank" rel="noreferrer"><FileText size={15} /> Resume</a>}
                    </div>
                    <div className="candidate-social-row">
                      {socialIconLink(item.student?.studentProfile?.linkedIn, "LinkedIn", Link)}
                      {socialIconLink(item.student?.studentProfile?.github, "GitHub", GitBranch)}
                      {socialIconLink(item.student?.studentProfile?.portfolio, "Portfolio", Globe)}
                    </div>
                    {openMessageForm === item._id && (
                      <div className="candidate-message-form">
                        <strong>Message {item.student?.name}</strong>
                        <textarea className="form-control form-control-sm" placeholder="Write a message to this candidate" value={candidateMessages[item._id] || ""} onChange={(event) => setCandidateMessages((current) => ({ ...current, [item._id]: event.target.value }))} />
                        <div className="actions">
                          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setOpenMessageForm(null)}>Cancel</button>
                          <button className="btn btn-sm btn-success" type="button" onClick={() => sendCandidateMessage(item)}><Send size={15} /> Send</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="candidate-workflow">
                  <div className="mini-form">
                    <strong><CalendarClock size={15} /> Interview</strong>
                    <input className="form-control form-control-sm" type="datetime-local" value={interviewForms[item._id]?.scheduledAt || ""} onChange={(event) => setInterviewField(item._id, "scheduledAt", event.target.value)} />
                    <select className="form-select form-select-sm" value={interviewForms[item._id]?.mode || ""} onChange={(event) => setInterviewField(item._id, "mode", event.target.value)}>
                      <option value="">Mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Phone">Phone</option>
                    </select>
                    <input className="form-control form-control-sm" placeholder="Meeting link or venue" value={interviewForms[item._id]?.link || ""} onChange={(event) => setInterviewField(item._id, "link", event.target.value)} />
                    <input className="form-control form-control-sm" placeholder="Notes" value={interviewForms[item._id]?.notes || ""} onChange={(event) => setInterviewField(item._id, "notes", event.target.value)} />
                    <button className="btn btn-sm btn-outline-success" onClick={() => scheduleInterview(item)}>Schedule Interview</button>
                  </div>

                  <div className="mini-form">
                    <strong><FileText size={15} /> Offer Letter</strong>
                    <textarea className="form-control form-control-sm" placeholder="Generate or write offer letter" value={offerLetters[item._id] || ""} onChange={(event) => setOfferLetters((current) => ({ ...current, [item._id]: event.target.value }))} />
                    <div className="actions">
                      <button className="btn btn-sm btn-outline-warning" onClick={() => generateOfferLetter(item)}>Generate</button>
                      <button className="btn btn-sm btn-success" onClick={() => sendOffer(item)}>Send Offer</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>}
        <Notifications user={user} scrollable />
      </div>
    </>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeAdminPanel, setActiveAdminPanel] = useState("users");
  const [adminSearch, setAdminSearch] = useState("");

  function load() {
    api.get("/admin/users").then(({ data }) => setUsers(data)).catch(() => { });
    api.get("/admin/jobs").then(({ data }) => setJobs(data)).catch(() => { });
    api.get("/admin/applications").then(({ data }) => setApplications(data)).catch(() => { });
  }

  useEffect(load, []);

  async function approveUser(id, status) {
    try {
      await api.patch(`/admin/users/${id}/approval`, { status });
      toastSuccess(`HR account ${status}.`);
      load();
    } catch (error) {
      toastError(error.response?.data?.message || "Could not update user.");
    }
  }

  async function moderateJob(id, status) {
    try {
      await api.patch(`/admin/jobs/${id}/status`, { status });
      toastSuccess(`Job marked ${status}.`);
      load();
    } catch (error) {
      toastError(error.response?.data?.message || "Could not moderate job.");
    }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Delete ${user.name}? This removes related activity from the portal.`)) return;

    try {
      await api.delete(`/admin/users/${user._id}`);
      toastWarning("User deleted from portal.", "Deleted");
      load();
    } catch (error) {
      toastError(error.response?.data?.message || "Could not delete user.");
    }
  }

  async function deleteJob(job) {
    if (!window.confirm(`Delete job post "${job.title}"? Related applications will also be removed.`)) return;

    try {
      await api.delete(`/admin/jobs/${job._id}`);
      toastWarning("Job post deleted.", "Deleted");
      load();
    } catch (error) {
      toastError(error.response?.data?.message || "Could not delete job post.");
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  const searchTerms = normalize(adminSearch).split(" ").filter(Boolean);
  const matchesSearch = (value) => searchTerms.length === 0 || searchTerms.every((term) => normalize(value).includes(term));
  const pendingHrs = users.filter((user) => user.role === "hr" && user.status === "pending");
  const visibleUsers = useMemo(() => users.filter((user) => matchesSearch([
    user.name,
    user.email,
    user.role,
    user.status,
    user.studentProfile?.skills?.join(" "),
    user.studentProfile?.softSkills?.join(" "),
    user.studentProfile?.education,
    user.studentProfile?.experience,
    user.studentProfile?.degree,
    user.studentProfile?.college,
    user.studentProfile?.passingYear,
    user.studentProfile?.cgpa,
    user.studentProfile?.internships,
    user.studentProfile?.partTimeJobs,
    user.studentProfile?.freelanceWork,
    user.studentProfile?.role,
    user.studentProfile?.companyName,
    user.studentProfile?.duration,
    user.studentProfile?.responsibilities,
    user.studentProfile?.linkedIn,
    user.studentProfile?.github,
    user.studentProfile?.portfolio,
    user.companyProfile?.companyName,
    user.companyProfile?.industry
  ].join(" "))), [users, adminSearch]);
  const visibleJobs = useMemo(() => jobs.filter((job) => matchesSearch([
    job.title,
    job.company,
    job.location,
    job.category,
    job.status,
    job.postedBy?.name,
    job.postedBy?.email,
    job.postedBy?.status
  ].join(" "))), [jobs, adminSearch]);
  const visibleApplications = useMemo(() => applications.filter((application) => matchesSearch([
    application.student?.name,
    application.student?.email,
    application.student?.studentProfile?.skills?.join(" "),
    application.student?.studentProfile?.softSkills?.join(" "),
    application.student?.studentProfile?.education,
    application.student?.studentProfile?.experience,
    application.student?.studentProfile?.degree,
    application.student?.studentProfile?.college,
    application.student?.studentProfile?.cgpa,
    application.student?.studentProfile?.internships,
    application.student?.studentProfile?.partTimeJobs,
    application.student?.studentProfile?.freelanceWork,
    application.student?.studentProfile?.role,
    application.student?.studentProfile?.companyName,
    application.student?.studentProfile?.duration,
    application.student?.studentProfile?.responsibilities,
    application.student?.studentProfile?.linkedIn,
    application.student?.studentProfile?.github,
    application.student?.studentProfile?.portfolio,
    application.job?.title,
    application.job?.company,
    application.job?.location,
    application.status,
    application.hr?.name
  ].join(" "))), [applications, adminSearch]);

  return (
    <>
      <div className="metrics-grid dashboard-section">
        <Metric icon={Users} label="Users" value={users.length} active={activeAdminPanel === "users"} onClick={() => setActiveAdminPanel("users")} />
        <Metric icon={UserCheck} label="HR Approval" value={pendingHrs.length} active={activeAdminPanel === "pending"} onClick={() => setActiveAdminPanel("pending")} />
        <Metric icon={BriefcaseBusiness} label="Job Posts" value={jobs.length} active={activeAdminPanel === "jobs"} onClick={() => setActiveAdminPanel("jobs")} />
        <Metric icon={CheckCircle2} label="Activity" value={applications.length} active={activeAdminPanel === "applications"} onClick={() => setActiveAdminPanel("applications")} />
      </div>
      <div className="admin-toolbar dashboard-section">
        <input className="form-control" placeholder="Search users, HR, jobs, applications, candidate profiles, company, status" value={adminSearch} onChange={(event) => setAdminSearch(event.target.value)} />
        <button className="btn btn-outline-success" type="button" onClick={load}><RefreshCw size={15} /> Refresh</button>
        {adminSearch && <button className="btn btn-outline-secondary" type="button" onClick={() => setAdminSearch("")}>Clear</button>}
      </div>
      <div className="dashboard-grid dashboard-section">
        {activeAdminPanel === "users" && <section className="card border-0 shadow-sm panel wide">
          <h2>User Management</h2>
          <p className="muted">Manage student accounts, HR accounts, candidate profiles, and employer approval status.</p>
          <div className="stack admin-list-scroll">
            {visibleUsers.length === 0 && <p className="text-secondary mb-0">No users match this search.</p>}
            {visibleUsers.map((user) => (
              <article className="row-card border rounded p-3 bg-light" key={user._id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email} - {user.role} - {user.status}</span>
                  {user.role === "student" && <span>Skills: {user.studentProfile?.skills?.join(", ") || "Not added"} - Degree: {user.studentProfile?.degree || user.studentProfile?.education || "Not added"} - College: {user.studentProfile?.college || "Not added"} - Experience: {user.studentProfile?.experience || user.studentProfile?.duration || "Not added"}</span>}
                  {user.role === "hr" && <span>Company: {user.companyProfile?.companyName || "Not added"} - Industry: {user.companyProfile?.industry || "Not added"}</span>}
                </div>
                {user.role === "hr" && user.status === "pending" && <div className="actions"><button className="btn btn-sm btn-outline-success" onClick={() => approveUser(user._id, "approved")}>Approve</button><button className="btn btn-sm btn-outline-danger" onClick={() => approveUser(user._id, "rejected")}>Reject</button></div>}
                {user.role === "hr" && user.status === "approved" && <span className="badge text-bg-primary">Approved</span>}
                <div className="actions">
                  {user.role === "hr" && user.status === "rejected" && <><span className="badge text-bg-danger">Rejected</span><button className="btn btn-sm btn-outline-success" onClick={() => approveUser(user._id, "approved")}>Approve again</button></>}
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteUser(user)}><Trash2 size={15} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>}
        {activeAdminPanel === "pending" && <section className="card border-0 shadow-sm panel wide">
          <h2>HR Registration and Approval</h2>
          <p className="muted">Approve or reject employer registrations before they can post jobs.</p>
          <div className="stack admin-list-scroll admin-approval-scroll">
            {pendingHrs.length === 0 && <p className="text-secondary mb-0">No pending HR accounts.</p>}
            {pendingHrs.map((user) => (
              <article className="row-card border rounded p-3 bg-light" key={user._id}>
                <div><strong>{user.name}</strong><span>{user.email} - {user.status}</span><span>Company: {user.companyProfile?.companyName || "Not added"} - Industry: {user.companyProfile?.industry || "Not added"}</span></div>
                <div className="actions"><button className="btn btn-sm btn-outline-success" onClick={() => approveUser(user._id, "approved")}>Approve</button><button className="btn btn-sm btn-outline-danger" onClick={() => approveUser(user._id, "rejected")}>Reject</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteUser(user)}><Trash2 size={15} /> Delete</button></div>
              </article>
            ))}
          </div>
        </section>}
        {activeAdminPanel === "jobs" && <section className="card border-0 shadow-sm panel wide">
          <h2>Platform Moderation: Job Postings</h2>
          <p className="muted">Monitor job postings and employer activity.</p>
          <div className="stack admin-list-scroll">
            {visibleJobs.length === 0 && <p className="text-secondary mb-0">No jobs match this search.</p>}
            {visibleJobs.map((job) => (
              <article className="row-card border rounded p-3 bg-light" key={job._id}>
                <div>
                  <strong>{job.title}</strong>
                  <span>{job.company} - {job.location} - {job.category} - {job.status}</span>
                  <span>Posted by {job.postedBy?.name || "Unknown HR"} - {job.postedBy?.email || "No email"} - HR status: {job.postedBy?.status || "unknown"}</span>
                </div>
                <div className="actions"><button className="btn btn-sm btn-outline-success" onClick={() => moderateJob(job._id, "active")}>Active</button><button className="btn btn-sm btn-outline-secondary" onClick={() => moderateJob(job._id, "closed")}>Close</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => deleteJob(job)}><Trash2 size={15} /> Delete</button></div>
              </article>
            ))}
          </div>
        </section>}
        {activeAdminPanel === "applications" && <section className="card border-0 shadow-sm panel wide">
          <h2>Platform Moderation: Candidate Activity</h2>
          <p className="muted">Monitor candidate profiles, employer responses, and hiring activity.</p>
          <div className="stack admin-list-scroll">
            {visibleApplications.length === 0 && <p className="text-secondary mb-0">No applications match this search.</p>}
            {visibleApplications.map((application) => (
              <article className="row-card border rounded p-3 bg-light" key={application._id}>
                <div>
                  <strong>{application.student?.name || "Student"} applied for {application.job?.title || "removed job"}</strong>
                  <span>{application.job?.company || "Company unavailable"} - {application.job?.location || "Location unavailable"} - {application.status}</span>
                  <span>Candidate: {application.student?.email || "No email"} - Skills: {application.student?.studentProfile?.skills?.join(", ") || "Not added"} - Degree: {application.student?.studentProfile?.degree || application.student?.studentProfile?.education || "Not added"} - College: {application.student?.studentProfile?.college || "Not added"} - Experience: {application.student?.studentProfile?.experience || application.student?.studentProfile?.duration || "Not added"}</span>
                </div>
                <span className="badge text-bg-primary">{application.hr?.name || "HR unavailable"}</span>
              </article>
            ))}
          </div>
        </section>}
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section>
        <div className="page-title"><p>Login required</p><h1>HireNest</h1></div>
        <section className="card border-0 shadow-sm panel"><p className="mb-0">Please login or register to open your role-based dashboard.</p></section>
      </section>
    );
  }

  return (
    <section>
      <div className="page-title">
        <p>{user.role} dashboard</p>
        <h1>{user.role === "student" ? "Student Dashboard" : user.role === "hr" ? "Employer Dashboard" : "Admin Dashboard"}</h1>
      </div>
      {user.role === "student" && <StudentDashboard user={user} />}
      {user.role === "hr" && <HrDashboard user={user} />}
      {user.role === "admin" && <AdminDashboard />}
    </section>
  );
}
