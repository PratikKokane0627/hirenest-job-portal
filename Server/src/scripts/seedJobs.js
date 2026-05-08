import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

dotenv.config();

await connectDB();

const hrPassword = "hr12345";
const hashedHrPassword = await bcrypt.hash(hrPassword, 10);

const hr = await User.findOneAndUpdate(
  { email: "hr@talentbridge.com" },
  {
    name: "TalentBridge HR",
    email: "hr@talentbridge.com",
    password: hashedHrPassword,
    role: "hr",
    status: "approved",
    companyProfile: {
      companyName: "TalentBridge Careers",
      website: "https://talentbridge.example",
      industry: "Recruitment",
      description: "Campus hiring and early-career recruitment partner."
    }
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const jobs = [
  {
    title: "Frontend Developer Intern",
    company: "PixelSoft Labs",
    location: "Bengaluru",
    industry: "Software",
    salary: "15000 - 25000",
    category: "Internship",
    status: "active",
    skills: ["React", "JavaScript", "CSS"],
    description: "Build responsive React screens and reusable UI components."
  },
  {
    title: "MERN Stack Developer",
    company: "CodeCraft Systems",
    location: "Hyderabad",
    industry: "Software",
    salary: "450000 - 700000",
    category: "Full-time",
    status: "active",
    skills: ["MongoDB", "Express", "React", "Node"],
    description: "Develop full-stack features for customer-facing web applications."
  },
  {
    title: "Backend Node.js Intern",
    company: "ApiNest Technologies",
    location: "Pune",
    industry: "Software",
    salary: "12000 - 22000",
    category: "Internship",
    status: "closed",
    skills: ["Node", "Express", "MongoDB"],
    description: "Assist in REST API development, testing, and database integration."
  },
  {
    title: "UI Designer Part-time",
    company: "StudioFrame",
    location: "Remote",
    industry: "Design",
    salary: "20000 - 35000",
    category: "Part-time",
    status: "active",
    skills: ["Figma", "UI Design", "Prototyping"],
    description: "Design web app screens, wireframes, and interactive prototypes."
  },
  {
    title: "Data Analyst Trainee",
    company: "InsightGrid Analytics",
    location: "Chennai",
    industry: "Analytics",
    salary: "300000 - 420000",
    category: "Full-time",
    status: "expired",
    skills: ["Excel", "SQL", "Power BI"],
    description: "Prepare dashboards, clean datasets, and support business reports."
  },
  {
    title: "Digital Marketing Intern",
    company: "MarketWave",
    location: "Mumbai",
    industry: "Marketing",
    salary: "10000 - 18000",
    category: "Internship",
    status: "active",
    skills: ["SEO", "Content", "Social Media"],
    description: "Support SEO, campaign tracking, and social media content planning."
  },
  {
    title: "Java Developer Fresher",
    company: "EnterpriseEdge",
    location: "Noida",
    industry: "Software",
    salary: "350000 - 550000",
    category: "Full-time",
    status: "active",
    skills: ["Java", "Spring Boot", "SQL"],
    description: "Work on enterprise modules, APIs, and database-backed services."
  },
  {
    title: "HR Recruiter Intern",
    company: "PeopleFirst Consulting",
    location: "Delhi",
    industry: "Human Resources",
    salary: "10000 - 16000",
    category: "Internship",
    status: "closed",
    skills: ["Recruitment", "Communication", "Screening"],
    description: "Screen candidates, schedule interviews, and maintain hiring trackers."
  },
  {
    title: "QA Testing Trainee",
    company: "BugShield QA",
    location: "Kochi",
    industry: "Software Testing",
    salary: "250000 - 380000",
    category: "Full-time",
    status: "active",
    skills: ["Manual Testing", "Selenium", "Jira"],
    description: "Create test cases, report defects, and support regression testing."
  },
  {
    title: "Graphic Design Freelancer",
    company: "BrandMint",
    location: "Remote",
    industry: "Design",
    salary: "Project based",
    category: "Freelance",
    status: "active",
    skills: ["Photoshop", "Illustrator", "Branding"],
    description: "Create social media creatives, banners, and brand assets."
  },
  {
    title: "Cloud Support Associate",
    company: "CloudWorks",
    location: "Gurugram",
    industry: "Cloud Services",
    salary: "400000 - 600000",
    category: "Full-time",
    status: "expired",
    skills: ["AWS", "Linux", "Networking"],
    description: "Support cloud deployments, tickets, monitoring, and documentation."
  },
  {
    title: "Mobile App Developer Intern",
    company: "AppOrbit",
    location: "Ahmedabad",
    industry: "Mobile Apps",
    salary: "14000 - 24000",
    category: "Internship",
    status: "active",
    skills: ["React Native", "JavaScript", "Firebase"],
    description: "Build mobile app screens and integrate APIs for student projects."
  },
  {
    title: "Business Development Executive",
    company: "GrowthLane",
    location: "Jaipur",
    industry: "Sales",
    salary: "300000 - 500000",
    category: "Full-time",
    status: "active",
    skills: ["Sales", "CRM", "Communication"],
    description: "Generate leads, handle client calls, and maintain CRM records."
  },
  {
    title: "Content Writer Part-time",
    company: "WriteWell Media",
    location: "Remote",
    industry: "Content",
    salary: "12000 - 20000",
    category: "Part-time",
    status: "closed",
    skills: ["Writing", "Editing", "SEO"],
    description: "Write blogs, job posts, and web content for client campaigns."
  },
  {
    title: "Cybersecurity Analyst Trainee",
    company: "SecureLayer",
    location: "Bengaluru",
    industry: "Cybersecurity",
    salary: "420000 - 650000",
    category: "Full-time",
    status: "active",
    skills: ["Security", "Networking", "Linux"],
    description: "Monitor alerts, document incidents, and learn security operations."
  },
  {
    title: "Database Administrator Intern",
    company: "DataKeep",
    location: "Pune",
    industry: "Database Services",
    salary: "12000 - 20000",
    category: "Internship",
    status: "active",
    skills: ["MongoDB", "SQL", "Backup"],
    description: "Assist with database backups, indexes, and basic performance checks."
  },
  {
    title: "Python Developer Fresher",
    company: "ScriptStone",
    location: "Indore",
    industry: "Software",
    salary: "320000 - 520000",
    category: "Full-time",
    status: "expired",
    skills: ["Python", "Django", "REST API"],
    description: "Build Python APIs, write tests, and support backend services."
  },
  {
    title: "Customer Support Associate",
    company: "HelpHub Services",
    location: "Kolkata",
    industry: "Customer Support",
    salary: "220000 - 360000",
    category: "Full-time",
    status: "active",
    skills: ["Communication", "Email Support", "CRM"],
    description: "Resolve customer tickets and coordinate support responses."
  },
  {
    title: "Finance Operations Intern",
    company: "LedgerPoint",
    location: "Mumbai",
    industry: "Finance",
    salary: "10000 - 18000",
    category: "Internship",
    status: "closed",
    skills: ["Excel", "Accounting", "Reports"],
    description: "Support invoice tracking, finance reports, and spreadsheet updates."
  },
  {
    title: "DevOps Intern",
    company: "DeployMate",
    location: "Remote",
    industry: "Software",
    salary: "15000 - 26000",
    category: "Internship",
    status: "active",
    skills: ["Git", "Docker", "CI/CD"],
    description: "Assist with deployment pipelines, Docker files, and release notes."
  }
];

function expiryFor(status, index) {
  const date = new Date();
  if (status === "expired") {
    date.setDate(date.getDate() - (index + 2));
    return date;
  }

  if (status === "closed") {
    date.setDate(date.getDate() + 10 + index);
    return date;
  }

  date.setDate(date.getDate() + 30 + index);
  return date;
}

let created = 0;

for (const [index, job] of jobs.entries()) {
  const result = await Job.updateOne(
    { title: job.title, company: job.company },
    {
      $set: {
        ...job,
        expiryDate: expiryFor(job.status, index),
        postedBy: hr._id
      }
    },
    { upsert: true }
  );

  if (result.upsertedCount) created += 1;
}

console.log(`Seeded ${jobs.length} jobs. New jobs created: ${created}.`);
console.log(`Seed HR login: hr@talentbridge.com / ${hrPassword}`);
console.log("Statuses included: active, closed, expired.");
process.exit(0);
