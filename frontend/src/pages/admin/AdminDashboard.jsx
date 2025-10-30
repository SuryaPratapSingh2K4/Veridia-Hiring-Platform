import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [jobs, setJobs] = useState([]);
    const [filteredJob, setFilteredJob] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:7000/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                // Sort: pinned first, then latest
                const sorted = data.sort((a, b) => {
                    if (a.pinned === b.pinned)
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    return b.pinned - a.pinned;
                });

                setJobs(sorted);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [token]);

    // Filter jobs by search
    useEffect(() => {
        if (!search) return setFilteredJob(jobs);

        const lowerSearch = search.toLowerCase();
        const filtered = jobs.filter((j) => {
            const title = j.title.toLowerCase();
            const company = j.company.toLowerCase();
            const location = j.location.toLowerCase();
            const type = j.type.toLowerCase();

            return (
                title.includes(lowerSearch) ||
                company.includes(lowerSearch) ||
                location.includes(lowerSearch) ||
                type.includes(lowerSearch)
            );
        });
        setFilteredJob(filtered);
    }, [jobs, search]);

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
            <div className="mt-12 flex flex-col items-center gap-4">
                <h1 className="mt-8 underline font-bold text-2xl text-white">Admin Dashboard</h1>

                {/* Search and Post Job */}
                <div className="flex gap-4">
                    <input
                        type="search"
                        className="px-6 py-2 bg-slate-50 text-black shadow-sm shadow-black rounded-lg"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Link
                        to="/admin/post-job"
                        className="py-2 bg-green-600 px-8 text-white shadow-sm shadow-black rounded-lg font-semibold hover:bg-green-700"
                    >
                        + Post a New Job
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex text-3xl font-bold mt-20">Loading....</div>
                ) : jobs.length === 0 ? (
                    // No jobs case
                    <div className="px-4 py-6 w-full">
                        <div className="mx-auto max-w-7xl bg-base-200 rounded-2xl shadow-md p-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
                                Welcome to Admin Dashboard
                            </h1>
                            <p className="text-sm md:text-base text-gray-400">
                                Post your first job to get started.
                            </p>
                        </div>
                    </div>
                ) : filteredJob.length === 0 ? (
                    // No matching jobs case
                    <div className="px-4 py-6 w-full">
                        <div className="mx-auto max-w-7xl bg-base-200 rounded-2xl shadow-md p-6">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
                                No jobs found
                            </h1>
                            <p className="text-sm md:text-base text-gray-400">
                                Try searching with different keywords or post a new job.
                            </p>
                        </div>
                    </div>
                ) : (
                    // ✅ Map through filtered jobs
                    filteredJob.map((j) => (
                        <div
                            key={j._id}
                            className="flex flex-col border shadow-sm shadow-black p-4 mt-2 rounded w-full  bg-white"
                        >
                            <label className="font-bold">
                                Title: <span className="font-normal">{j.title}</span>
                            </label>

                            <label className="font-bold">
                                Company: <span className="font-normal">{j.company}</span>
                            </label>

                            <label className="font-bold">
                                Location: <span className="font-normal">{j.location}</span>
                            </label>

                            <label className="font-bold">
                                Type: <span className="font-normal">{j.type}</span>
                            </label>

                            <label className="font-bold">Job Description:</label>
                            <h3 className="text-gray-700">{j.description}</h3>

                            <label className="font-bold">Job Requirements:</label>
                            <h3 className="text-gray-700">{j.requirements}</h3>

                            <div className="mt-2">
                                <Link
                                    to={`/admin/applicants?jobId=${j._id}`}
                                    className="underline hover:font-bold text-blue-700"
                                >
                                    View Applicants
                                </Link>
                                
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
