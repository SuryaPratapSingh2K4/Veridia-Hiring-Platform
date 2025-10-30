import Application from "../models/application.js";
import Job from "../models/JobSchema.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import s3 from "../config/s3.js";
import getResumeUrl from "../utils/resumeURL.js";
dotenv.config();

const randomFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

// ✅ APPLY TO JOB
export async function applyToJob(req, res) {
  try {
    console.log("---- 🧾 applyToJob hit ----");
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.originalname : "❌ No file");
    console.log("User:", req.user ? req.user._id : "❌ No user");

    const { jobId, coverLetter } = req.body;

    // ✅ Validate job ID
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    // ✅ Upload resume to S3 (if provided)
    let resumeURL = null;
    if (req.file) {
      try {
        const resumeName = `${Date.now()}-${randomFileName()}-${
          req.file.originalname
        }`;
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `resumes/${resumeName}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          // ❌ No ACL (Bucket owner enforced mode)
        };

        console.log("🚀 Uploading to S3:", params.Bucket, params.Key);

        await s3.send(new PutObjectCommand(params));

        resumeURL = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/resumes/${resumeName}`;
        console.log("✅ S3 upload success:", resumeURL);
      } catch (s3Err) {
        console.error("❌ S3 upload error:", s3Err);
        return res.status(500).json({
          message: "Failed to upload resume to S3",
          error: s3Err.message,
        });
      }
    } else {
      console.log("⚠️ No resume file uploaded");
    }

    // ✅ Save application in MongoDB
    const newApplication = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: resumeURL,
    });

    // ✅ Send confirmation email
    try {
      await sendEmail(
        req.user.email,
        `Application received for ${jobData.title}`,
        `Hello ${req.user.name},\n\nWe have received your application for "${jobData.title}".\nOur team will review your profile and get back to you soon.\n\nBest regards,\nVeridia Hiring Team`
      );
      console.log("📩 Email sent successfully");
    } catch (emailErr) {
      console.warn("⚠️ Could not send confirmation email:", emailErr.message);
    }

    return res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (err) {
    console.error("💥 applyToJob error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

// ✅ GET MY APPLICATIONS (for users)
export async function getMyApplications(req, res) {
  try {
    const apps = await Application.find({ applicant: req.user._id }).populate(
      "job"
    );
    return res.json(apps);
  } catch (error) {
    console.error("getMyApplications error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

// ✅ GET APPLICATIONS FOR ADMIN
export async function getApplicationForAdmin(req, res) {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const apps = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("applicant", "name email");

      for(const a of apps){
        if(a.resume){
          const key = a.resume.split(".com/")[1];
          const signedUrl = await getResumeUrl(key);
          if(signedUrl) a.resume = signedUrl;
        }
      }

    res.json(apps);
  } catch (error) {
    console.error("getApplicationForAdmin error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

// ✅ UPDATE APPLICATION STATUS
export async function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(id)
      .populate("job")
      .populate("applicant", "name email");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    try {
      await sendEmail(
        application.applicant.email,
        `Your application status for ${application.job.title} has been updated`,
        `Hello ${application.applicant.name},\n\nYour application for "${application.job.title}" has been updated to: ${status}.\n\nThank you,\nVeridia Hiring Team`
      );
      console.log("📩 Status update email sent");
    } catch (emailError) {
      console.warn(
        "⚠️ Could not send status update email:",
        emailError.message
      );
    }

    return res.json({
      message: "Status updated successfully",
      application,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
