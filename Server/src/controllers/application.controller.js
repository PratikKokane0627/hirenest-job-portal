import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { createNotification } from "../utils/notifications.js";

export async function applyForJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = await Application.create({
      job: job._id,
      student: req.user._id,
      hr: job.postedBy,
      resumeUrl: req.user.studentProfile?.resumeUrl,
      coverLetter: req.body?.coverLetter
    });

    await createNotification(job.postedBy, {
      title: "New application received",
      body: `${req.user.name} applied for ${job.title}`,
      type: "application"
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already applied to this job" });
    }
    next(error);
  }
}

export async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("job")
      .populate("hr", "name companyProfile")
      .sort("-createdAt");
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

export async function getHrApplications(req, res, next) {
  try {
    const applications = await Application.find({ hr: req.user._id })
      .populate("job")
      .populate("student", "name email studentProfile")
      .sort("-createdAt");
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, hr: req.user._id },
      {
        status: req.body.status,
        interview: req.body.interview,
        offerLetter: req.body.offerLetter,
        offerLetterUrl: req.body.offerLetterUrl
      },
      { new: true, runValidators: true }
    ).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });

    await createNotification(application.student, {
      title: "Application status updated",
      body: `${application.job.title} is now ${application.status}`,
      type: "status"
    });

    res.json(application);
  } catch (error) {
    next(error);
  }
}
