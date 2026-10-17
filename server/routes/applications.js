import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { protect, employerOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "seeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const { jobId, message } = req.body;

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });
    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      message,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/job/:jobId", protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protect, employerOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }

    application.status = req.body.status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;