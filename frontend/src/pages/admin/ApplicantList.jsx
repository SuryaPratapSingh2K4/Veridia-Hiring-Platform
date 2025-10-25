import React, { useEffect, useState } from "react";

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
                if (!res.ok) throw new Error(data.message || "Failed to fetch");
                setApplications(data);
                setFilteredApps(data);
            } catch (error) {
                console.error("Error fetching applicants:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [token]);

    // ✅ Get unique jobs for dropdown filter

    const jobIds = applications.map((a) => a.job._id);
    // const uniqueJobIds = [...new Set(jobIds)];
    const jobs = jobIds.map(
        (id) => applications.find((a) => a.job._id === id).job
    );

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

    // ✅ Render section
    return (
        <div className="p-8">
            <div className="mt-12 flex flex-col items-center gap-4">
                <h1 className="underline font-bold text-2xl">Job Applicants</h1>

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
                            className="flex flex-col border shadow-sm shadow-black p-4 mt-2 rounded w-full  bg-white"
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
                                <span className="font-normal">
                                    {a.job?.title || "Job Deleted"}
                                </span>
                            </label>

                            <label className="font-bold">
                                Cover Letter:
                                <p className="text-gray-700">{a.coverLetter || "Job-Description not available"}</p>
                            </label>

                            <label className="font-bold">
                                Status:{" "}
                                <span className="font-normal">{a.status || "Pending"}</span>
                            </label>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ApplicantList;
