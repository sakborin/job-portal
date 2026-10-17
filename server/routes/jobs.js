import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { protect, employerOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    const jobs = await Job.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/mine", protect, employerOnly, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user.id });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Please fill all required fields" });
  }
});

router.put("/:id", protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, employerOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your job" });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;