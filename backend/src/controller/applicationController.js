import Application from "../models/application.js";
import Job from "../models/JobSchema.js";

export async function applyToJob(req, res) {
    try {
        const { job, coverLetter } = req.body;
        if (!job) return res.status(404).json({ message: "Job not found" });
        const jobData = await Job.findById(job);
        if(!jobData) return res.status(404).json({message: "Job Not Found"});
        const alreadyApplied = await Application.findOne({
        job,
        applicant: req.user._id,
        });
        if (alreadyApplied) return res.status(400).json({ message: "Already applied" });
        const newApplication = await Application.create({
        job,
        applicant: req.user._id,
        coverLetter,
        });
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
