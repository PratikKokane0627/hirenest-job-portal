import React, { useEffect, useState } from "react";
import { Bookmark, BriefcaseBusiness, Building2, IndianRupee, MapPin, Send, Search, Sparkles } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../state/AuthContext.jsx";
import { toastError, toastSuccess, toastWarning } from "../utils/toast.js";

const initialFilters = {
  q: "",
  location: "",
  industry: "",
  salary: "",
  category: ""
};

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await api.get("/jobs", { params });
      setJobs(data);
      setLoading(false);
    }

    loadJobs().catch(() => setLoading(false));
  }, [filters]);

  async function apply(jobId) {
    try {
      await api.post(`/applications/${jobId}`);
      toastSuccess("Application submitted and sent to HR.");
    } catch (error) {
      const message = error.response?.data?.message || "Could not apply for this job.";
      if (error.response?.status === 409) {
        toastWarning(message, "Already Applied");
      } else if (!user) {
        toastWarning("Please login as a student before applying.", "Login Required");
      } else {
        toastError(message);
      }
    }
  }

  async function bookmark(jobId) {
    try {
      await api.post(`/jobs/${jobId}/bookmark`);
      toastSuccess("Job saved for later.");
    } catch (error) {
      if (!user) {
        toastWarning("Please login as a student before saving jobs.", "Login Required");
      } else {
        toastError(error.response?.data?.message || "Could not save this job.");
      }
    }
  }

  return (
    <section>
      <div className="page-title">
        <p>Search opportunities</p>
        <h1>Jobs</h1>
      </div>

      <div className="row g-2 align-items-stretch">
        <label className="col-12 col-xl-4 search-box">
          <Search size={18} />
          <input className="form-control border-0 shadow-none" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="Keyword, skill, or company" />
        </label>
        <div className="col-6 col-xl"><input className="form-control h-100" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Location" /></div>
        <div className="col-6 col-xl"><input className="form-control h-100" value={filters.industry} onChange={(event) => setFilters({ ...filters, industry: event.target.value })} placeholder="Industry" /></div>
        <div className="col-6 col-xl"><input className="form-control h-100" value={filters.salary} onChange={(event) => setFilters({ ...filters, salary: event.target.value })} placeholder="Salary" /></div>
        <div className="col-6 col-xl"><select className="form-select h-100" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
          <option value="">All categories</option>
          <option>Internship</option>
          <option>Part-time</option>
          <option>Full-time</option>
          <option>Freelance</option>
        </select></div>
      </div>

      <div className="job-list">
        {loading && <p>Loading jobs...</p>}
        {!loading && jobs.length === 0 && <p>No jobs found.</p>}
        {jobs.map((job) => (
          <article className="card border-0 shadow-sm job-card" key={job._id}>
            <div className="job-card-main">
              <div className="job-avatar">
                <BriefcaseBusiness size={22} />
              </div>
              <div className="job-card-copy">
                <div className="job-card-top">
                  <div>
                    <h2>{job.title}</h2>
                    <p><Building2 size={15} /> {job.company}</p>
                  </div>
                  <span className="job-category">{job.category}</span>
                </div>
                <div className="job-meta">
                  <span><MapPin size={15} /> {job.location}</span>
                  <span><IndianRupee size={15} /> {job.salary || "Not disclosed"}</span>
                  {job.industry && <span><Sparkles size={15} /> {job.industry}</span>}
                </div>
                {job.skills?.length > 0 && (
                  <div className="skill-list">
                    {job.skills.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                )}
              </div>
            </div>
            {user?.role === "student" && (
              <div className="job-actions">
                <button className="btn btn-outline-success" onClick={() => bookmark(job._id)}><Bookmark size={16} /> Save</button>
                <button className="btn btn-success" onClick={() => apply(job._id)}><Send size={16} /> Apply</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
