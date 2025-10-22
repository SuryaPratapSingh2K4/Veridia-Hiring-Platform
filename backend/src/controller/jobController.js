import Job from "../models/JobSchema.js";

export async function CreateJob(req, res) {
    try {
        const { title, description, location, requirements, type, company } =
        req.body;
        if (!title || !description || !location || !type || !company) {
        return res.status(400).json({ message: "All fields are required" });
        }
        const newJob = await Job.create({
        title,
        description,
        location,
        requirements,
        type,
        company,
        postedBy: req.user._id,
        });
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const listJobs = async (req, res) => {
    try {
        console.log("✅ Reached /api/jobs endpoint");
        console.log("User in request:", req.user);
        let filter = {};
        if (req.user?.role === "admin") {
        filter = { postedBy: req.user._id };
        } else {
        filter = { isActive: true };
        }
        console.log("Filter being used:", filter);
        const jobs = await Job.find(filter).populate("postedBy", "name email");
        console.log("Jobs found:", jobs.length);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404), json({ message: "Job Not Found" });
        if (job.postedBy.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not Authroized" });
        Object.assign(job, req.body);
        await job.save();
        res.status(201).json({ message: "Job Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== req.user._id.toString())
        return res.status(403).json({ message: "Not Authroized" });
        await job.remove();
        res.status(201).json({ message: "Job Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
