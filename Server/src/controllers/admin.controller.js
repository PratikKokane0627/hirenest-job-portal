import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { createNotification } from "../utils/notifications.js";

export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getJobsForModeration(req, res, next) {
  try {
    const jobs = await Job.find().populate("postedBy", "name email companyProfile status").sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    next(error);
  }
}

export async function getApplicationsForModeration(req, res, next) {
  try {
    const applications = await Application.find()
      .populate("student", "name email studentProfile status")
      .populate("hr", "name email companyProfile status")
      .populate("job", "title company location category status")
      .sort("-createdAt");
    res.json(applications);
  } catch (error) {
    next(error);
  }
}

export async function updateJobStatus(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("postedBy", "name email");

    if (!job) return res.status(404).json({ message: "Job not found" });

    await createNotification(job.postedBy._id || job.postedBy, {
      title: "Job status updated",
      body: `${job.title} is now ${job.status}`,
      type: "job"
    });

    res.json(job);
  } catch (error) {
    next(error);
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    await Promise.all([
      Application.deleteMany({ job: job._id }),
      User.updateMany({}, { $pull: { "studentProfile.savedJobs": job._id } })
    ]);

    res.json({ message: "Job post deleted" });
  } catch (error) {
    next(error);
  }
}

export async function updateUserApproval(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "hr") {
      await createNotification(user._id, {
        title: "HR account review updated",
        body: `Your employer account is now ${user.status}`,
        type: "approval"
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ message: "Admin cannot delete their own account while logged in" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const userJobs = await Job.find({ postedBy: user._id }).select("_id");
    const userJobIds = userJobs.map((job) => job._id);

    await Promise.all([
      Job.deleteMany({ postedBy: user._id }),
      Application.deleteMany({
        $or: [
          { student: user._id },
          { hr: user._id },
          { job: { $in: userJobIds } }
        ]
      }),
      Message.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] }),
      Notification.deleteMany({ user: user._id }),
      User.updateMany({}, { $pull: { "studentProfile.savedJobs": { $in: userJobIds } } })
    ]);

    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const [
      users,
      students,
      hrs,
      pendingHrs,
      jobs,
      activeJobs,
      applications,
      interviews,
      offers,
      rejected,
      usersWithSavedJobs,
      messages,
      notifications,
      savedJobStats
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "hr" }),
      User.countDocuments({ role: "hr", status: "pending" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "active" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "interview" }),
      Application.countDocuments({ status: "offered" }),
      Application.countDocuments({ status: "rejected" }),
      User.countDocuments({ "studentProfile.savedJobs.0": { $exists: true } }),
      Message.countDocuments(),
      Notification.countDocuments(),
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: { $size: { $ifNull: ["$studentProfile.savedJobs", []] } } }
          }
        }
      ])
    ]);

    res.json({
      users,
      students,
      hrs,
      pendingHrs,
      jobs,
      activeJobs,
      applications,
      interviews,
      offers,
      rejected,
      usersWithSavedJobs,
      messages,
      notifications,
      savedJobs: savedJobStats[0]?.total || 0
    });
  } catch (error) {
    next(error);
  }
}
