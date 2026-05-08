import Job from "../models/Job.js";
import User from "../models/User.js";

export async function getJobs(req, res, next) {
  try {
    const { q, location, industry, salary, category } = req.query;
    const filters = { status: "active" };

    if (q) filters.$text = { $search: q };
    if (location) filters.location = new RegExp(location, "i");
    if (industry) filters.industry = new RegExp(industry, "i");
    if (salary) filters.salary = new RegExp(salary, "i");
    if (category) filters.category = category;

    const jobs = await Job.find(filters).populate("postedBy", "name companyProfile").sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    next(error);
  }
}

export async function getSavedJobs(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .select("studentProfile.savedJobs")
      .populate({
        path: "studentProfile.savedJobs",
        match: { status: "active" }
      });

    res.json((user.studentProfile?.savedJobs || []).filter(Boolean));
  } catch (error) {
    next(error);
  }
}

export async function createJob(req, res, next) {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
}

export async function getMyJobs(req, res, next) {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort("-createdAt");
    res.json(jobs);
  } catch (error) {
    next(error);
  }
}

export async function updateJob(req, res, next) {
  try {
    const ownerFilter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, postedBy: req.user._id };
    const job = await Job.findOneAndUpdate(ownerFilter, req.body, { new: true, runValidators: true });

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    next(error);
  }
}

export async function bookmarkJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: "active" });
    if (!job) return res.status(400).json({ message: "Only active jobs can be saved" });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { "studentProfile.savedJobs": req.params.id }
    });
    res.json({ message: "Job saved" });
  } catch (error) {
    next(error);
  }
}

export async function removeBookmark(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { "studentProfile.savedJobs": req.params.id }
    });
    res.json({ message: "Job removed from saved jobs" });
  } catch (error) {
    next(error);
  }
}
