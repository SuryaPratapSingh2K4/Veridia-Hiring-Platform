import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function PostJob() {
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("Full-Time");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const handleCreate = async (e) => {
        e.preventDefault();
        const body = {
            title: title,
            company: company,
            location: location,
            type: type,
            description: description,
            requirements: requirements ? requirements.split(",").map((s) => s.trim()) : []
        }
        try {
            const res = await fetch('http://localhost:7000/api/jobs', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if (!res.ok) return alert(data.message || "Failed to create");
            // alert("Job Created");
            toast.success("Job Created Successfully");
            navigate("/admin")

        } catch (error) {
            console.error(error.message);
        }
    }
    return (
        <div className='p-8' >
            <div className='mt-12 flex flex-col items-center gap-4'>
                <h1 className='items-center underline font-bold text-2xl'>Create a Job Post</h1>
                <div className=''>
                    <form className='flex flex-col gap-4' onSubmit={handleCreate}>
                        <div className='w-full gap-4 flex flex-row'>
                            <div className='flex flex-col'>
                                <label className='font-bold mb-2'>Recruitment Title</label>
                                <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold mb-2'>Company Name</label>
                                <input type="text" placeholder='Company' value={company} onChange={(e) => setCompany(e.target.value)} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                            </div>
                        </div>
                        <div className='w-full gap-4 flex flex-row'>
                            <div className='flex flex-col'>
                                <label className='font-bold mb-2'>Location</label>
                                <input type="text" placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                            </div>
                            <div className='flex flex-col'>
                                <label className='font-bold mb-2'>Job-Type</label>
                                <select className='bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="full-time">Full-Time</option>
                                    <option value="part-time">Part-Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Requirements</label>
                            <input type="text" placeholder='Requirements' value={requirements} onChange={(e) => setRequirements(e.target.value)} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-full' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Job Description</label>
                            <textarea type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-full' rows={4} />
                        </div>
                        <button className='w-full bg-green-600 py-2 rounded-lg shadow-black shadow-md text-white font-semibold hover:bg-green-700'>Create Job</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostJob
