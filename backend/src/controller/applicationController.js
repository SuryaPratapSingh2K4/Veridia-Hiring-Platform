import Application from "../models/application.js";
import Job from "../models/JobSchema.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import s3 from "../config/s3.js";
dotenv.config();

const randomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function applyToJob(req, res) {
  try {
    const { job, coverLetter } = req.body;
    if (!job) return res.status(404).json({ message: "Job not found" });
    const jobData = await Job.findById(job);
    if (!jobData) return res.status(404).json({ message: "Job Not Found" });
    const alreadyApplied = await Application.findOne({
      job,
      applicant: req.user._id,
    });
    if (alreadyApplied)
      return res.status(400).json({ message: "Already applied" });

    let resumeURL = null;
    if (req.file) {
      const resumeName = randomFileName();
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: resumeName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await s3.send(command);

      resumeURL = `https://${process.env.BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${resumeName}`;
    }

    const newApplication = await Application.create({
      job,
      applicant: req.user._id,
      coverLetter,
      resume: resumeURL,
    });
    try {
      await sendEmail(
        req.user.email,
        `Application receieved for ${job.title}`,
        `Hello ${req.user.name}, \n \nWe have received your application for "${job.title}". Our team will review your profile and get back to you soon.\n\nBest regards,\nVeridia Hiring Team `
      );
    } catch (error) {
      console.error(
        "Could not send application confirmation email: ",
        error.message
      );
    }
    res.status(201).json({ message: "Application Submitted", newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMyApplications(req, res) {
  try {
    const apps = await Application.find({ applicant: req.user._id }).populate(
      "job"
    );
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getApplicationForAdmin(req, res) {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIds = await jobs.map((j) => j._id);
    const apps = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("applicant", "name email");
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const application = await Application.findById(id)
      .populate("job")
      .populate("applicant", "name email");

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      await sendEmail(
        application.applicant.email,
        `Your application status for ${application.job.title} has been updated`,
        `Hello ${application.applicant.name},\n\nYour application for "${application.job.title}" has been updated to: ${status}.\n\nThank you for applying!\n\nBest,\nVeridia Hiring Team`
      );
    } catch (emailError) {
      console.warn(
        "⚠️ Could not send status update email:",
        emailError.message
      );
    }

    res.json({ message: "Status updated successfully", application });

    application.status = status;
    await application.save();
  } catch (error) {}
}
