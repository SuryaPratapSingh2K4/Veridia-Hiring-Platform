import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:7000/api/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json();
                setJobs(data);

            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false)
            }
        }
        fetchJobs();
    }, [token])

    return (
        <div className='p-8'>
            <div className='mt-12 flex flex-col items-center gap-4'>
                <h1 className='items-center underline font-bold text-2xl'>Admin Dashboard</h1>
                <div className='flex gap-4'>
                    <input type="search" className='px-6 py-2 bg-slate-50 text-black shadow-sm shadow-black rounded-lg' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Link to='/admin/post-job' className='py-2 bg-green-600 px-8 text-white  shadow-sm shadow-black rounded-lg font-semibold hover:bg-green-700'>+ Post a New Job</Link>
                </div>
                {loading ? <div className='flex text-3xl font-bold mt-20'>Loading....</div> : <div className='grid gap-4'>
                    {
                        jobs.map((j) => (
                            <div key={j._id} className='flex flex-col border shadow-sm shadow-black p-4 mt-2 rounded'>
                                <label className='font-bold'>Title : <span className='font-normal'>{j.title}</span></label>

                                <label className='font-bold'>Company :  <span className='font-normal'>{j.company}</span></label>

                                <label className='font-bold'>Location : <span className='font-normal'>{j.location}</span></label>

                                <label className='font-bold'>Type : <span className='font-normal'>{j.type}</span></label>

                                <label className='font-bold'>Job Description</label>
                                <h3>{j.description}</h3>
                                <label className='font-bold'>Job Requirements</label>
                                <h3>{j.requirements}</h3>

                                <div>
                                    <Link to='/admin/applicants' className='underline hover:font-bold text-blue-700'>View Applicants</Link>
                                </div>
                            </div>))}
                </div>}
            </div>
        </div>
    )
}

export default AdminDashboard


