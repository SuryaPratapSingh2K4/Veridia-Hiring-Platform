import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ApplicantList() {
    const token = localStorage.getItem("token");
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [filterJob, setFilterJob] = useState("");
    const [loading, setLoading] = useState(true);

    // ✅ Fetch all applications for admin
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await fetch("http://localhost:7000/api/application/admin", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to fetch applicants");
                setApplications(data);
                setFilteredApps(data);
            } catch (error) {
                console.error("Error fetching applicants:", error.message);
                toast.error("Failed to fetch applicants");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [token]);

    // ✅ Get unique jobs for dropdown filter
    const jobIds = applications
        .filter((a) => a.job && a.job._id)
        .map((a) => a.job._id);
    const uniqueJobIds = [...new Set(jobIds)];
    const jobs = uniqueJobIds
        .map((id) => {
            const found = applications.find((a) => a.job && a.job._id === id);
            return found ? found.job : null;
        })
        .filter((j) => j !== null);

    // ✅ Filter applications when dropdown changes
    useEffect(() => {
        if (!filterJob) {
            setFilteredApps(applications);
        } else {
            const filtered = applications.filter(
                (a) => a.job && a.job._id === filterJob
            );
            setFilteredApps(filtered);
        }
    }, [filterJob, applications]);

    // ✅ Handle status change by admin
    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(
                `http://localhost:7000/api/application/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to update status");
                return;
            }
            toast.success(`Status updated to ${status}`);
            setApplications((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
        } catch (error) {
            console.error("Error updating status:", error.message);
            toast.error("Error updating status");
        }
    };

    // ✅ Render section
    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
            <div className="mt-12 flex flex-col items-center gap-4">
                <h1 className="underline font-bold text-2xl text-white">Job Applicants</h1>

                {/* Job Filter Dropdown */}
                <div className="flex gap-4">
                    <select
                        value={filterJob}
                        onChange={(e) => setFilterJob(e.target.value)}
                        className="border p-2 rounded bg-slate-50 text-black shadow-sm shadow-black"
                    >
                        <option value="">All Jobs</option>
                        {jobs.map(
                            (j) =>
                                j && (
                                    <option key={j._id} value={j._id}>
                                        {j.title}
                                    </option>
                                )
                        )}
                    </select>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-3xl font-bold mt-20">Loading...</div>
                ) : applications.length === 0 ? (
                    // ✅ No applications at all
                    <div className="px-4 py-6 w-full">
                        <div className="mx-auto max-w-7xl bg-base-200 rounded-2xl shadow-md p-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
                                No applicants yet
                            </h1>
                            <p className="text-sm md:text-base text-gray-400">
                                Once users apply for your jobs, their details will appear here.
                            </p>
                        </div>
                    </div>
                ) : (
                    // ✅ Map through filtered applicants (like AdminDashboard)
                    filteredApps.map((a) => (
                        <div
                            key={a._id}
                            className="flex flex-col border shadow-sm shadow-black p-4 mt-2 rounded w-full bg-white hover:shadow-md transition-all"
                        >
                            <label className="font-bold">
                                Applicant Name:{" "}
                                <span className="font-normal">
                                    {a.applicant?.name || "Unknown"}
                                </span>
                            </label>

                            <label className="font-bold">
                                Email:{" "}
                                <span className="font-normal">
                                    {a.applicant?.email || "No Email"}
                                </span>
                            </label>

                            <label className="font-bold">
                                Applied Job:{" "}
                                <span className="font-normal">{a.job?.title || "Job Deleted"}</span>
                            </label>

                            <label className="font-bold">
                                Cover Letter:
                                <p className="font-normal">
                                    {a.coverLetter || "No cover letter provided"}
                                </p>
                            </label>

                            {/* ✅ Resume Button */}
                            {a.resume && (
                                <div className="mt-3">
                                    <a
                                        href={a.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all"
                                    >
                                        📄 View Resume
                                    </a>
                                </div>
                            )}

                            <div className="flex flex-row items-center gap-3 mt-3">
                                <label className="font-bold">Status:</label>
                                <select
                                    className="border rounded p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={a.status}
                                    onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                </select>

                                <div
                                    className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${a.status === "Accepted"
                                            ? "bg-green-100 text-green-700"
                                            : a.status === "Rejected"
                                                ? "bg-red-100 text-red-700"
                                                : a.status === "Reviewed"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {a.status}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ApplicantList;
