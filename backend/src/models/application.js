import mongoose from "mongoose";

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
        required: true,
        },
        coverLetter: {
        type: String,
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

const application = mongoose.model("application", applicationSchema);
export default application;
