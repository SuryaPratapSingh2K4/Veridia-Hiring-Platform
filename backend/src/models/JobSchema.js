import mongoose from "mongoose";
import { trim } from "validator";

const JobSchema = new mongoose.Schema(
    {
        title: {
        type: String,
        required: true,
        trim: true,
        },
        company: {
        type: String,
        required: true,
        },
        location: {
        type: String,
        required: true,
        default: "Remote",
        },
        type: {
        type: String,
        required: true,
        enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
        default: "Full-Time",
        },
        description: {
        type: String,
        required: true,
        },
        requirements: {
        type: [String],
        default: [],
        },
        postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        isActive: {
        type: Boolean,
        default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
