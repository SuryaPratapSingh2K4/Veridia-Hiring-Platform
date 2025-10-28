import mongoose from "mongoose";
import { type } from "os";

const applicationSchema = new mongoose.Schema(
    {
        job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        },
        applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
        },
        coverLetter: {
        type: String,
        },
        resume: {
            type: File,
            required: true
        },
        status: {
        type: String,
        enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
        default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model("application", applicationSchema);
export default Application;
