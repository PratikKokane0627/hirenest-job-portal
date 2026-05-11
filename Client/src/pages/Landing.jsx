import { ArrowRight, BriefcaseBusiness, MessageCircle, ShieldCheck, Sparkles, UserPlus, UserRoundCheck, Zap } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import landingHero from "../assets/landing-hero.png";
import { useAuth } from "../state/AuthContext.jsx";

const features = [
  { icon: ShieldCheck, title: "Secure & Reliable", body: "Your data is safe with us with top-level security." },
  { icon: Zap, title: "Real-time Updates", body: "Get instant notifications on applications and activities." },
  { icon: MessageCircle, title: "In-app Messaging", body: "Communicate seamlessly within the platform." },
  { icon: UserRoundCheck, title: "Role-based Access", body: "Different dashboards for students, HRs & admins." }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <main className="landing-page">
      <nav className="navbar navbar-expand-lg landing-nav bg-white">
        <div className="container-fluid px-3 px-lg-5">
          <Link className="navbar-brand landing-brand d-flex align-items-center gap-2" to="/">
            <span className="landing-brand-icon"><BriefcaseBusiness size={22} /></span>
            <span>Hire<span>Nest</span></span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <Link className="btn btn-link landing-nav-link px-3" to="/jobs">Jobs</Link>
            <Link className="btn btn-primary landing-login-btn px-4" to={user ? "/dashboard" : "/login"}>
              {user ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      <section className="container-fluid px-3 px-lg-5 landing-hero">
        <div className="row align-items-center g-4 g-xl-5">
          <div className="col-12 col-xl-5">
            <div className="landing-copy">
              <span className="landing-kicker"><Sparkles size={16} /> Empowering Careers. Building Futures.</span>
              <h1>Find Jobs, Hire Fresh Talent, and Manage Recruitment <span>Easily.</span></h1>
              <p>
                A role-based HireNest portal for students, HR teams, and admins with job applications,
                interviews, messaging, and moderation.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link className="btn btn-primary btn-lg landing-main-cta" to={user ? "/dashboard" : "/register"}>
                  <UserPlus size={19} /> {user ? "Open Dashboard" : "Create Account"}
                </Link>
                <Link className="btn btn-outline-primary btn-lg landing-secondary-cta" to="/login">
                  Login <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-7">
            <div className="landing-visual">
              <img src={landingHero} alt="Students and recruiter using HireNest" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-fluid px-3 px-lg-5 pb-5">
        <div className="row g-0  landing-feature-strip">
          {features.map(({ icon: Icon, title, body }) => (
            <div className="col-12 col-md-6 col-xl-3 " key={title}>
              <article className="landing-feature h-100">
                <Icon size={24} />
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
