import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ApplicantForm() {
    const { id } = useParams();
    const [coverLetter, SetCoverLetter] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [jobDetails, setJobDetails] = useState(null);
    const handleApply = async (e) => {
        e.preventDefault();
        try {
            const body = {
                job: id,
                coverLetter: coverLetter
            }
            const res = await fetch('http://localhost:7000/api/application/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })
            const data = await res.json();
            if (!res.ok) return alert(data.message || "Failed to apply");
            alert("Application submitted");
            navigate('/user')
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        try {
            const fetchDetails = async () => {
                const res = await fetch(`http://localhost:7000/api/jobs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json();
                console.log(data);
                setJobDetails(data);

            }
            fetchDetails();
        } catch (error) {
            console.error(error.message);
        }
    }, [id, token])
    return (
        <div className='p-20'>
            <div className='mt-12 flex flex-col items-center gap-4'>
                <h1 className="underline font-bold text-2xl">Apply for Job</h1>
                <form onClick={handleApply}>
                    {/* <div className='w-full gap-4 flex flex-row'>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Recruitment Title</label>
                            <input type="text" placeholder='Title' value={jobDetails.title} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Company Name</label>
                            <input type="text" placeholder='Company' value={jobDetails.company} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                        </div>
                    </div> */}

{/* 
                    <div className='w-full gap-4 flex flex-row'>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Location</label>
                            <input type="text" placeholder='Location' value={jobDetails.location} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' />
                        </div>
                        <div className='flex flex-col'>
                            <label className='font-bold mb-2'>Job-Type</label>
                            <select className='bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-60' value={jobDetails.type}>
                                <option value="full-time">Full-Time</option>
                                <option value="part-time">Part-Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div> */}


                    <div className='flex flex-col'>
                        <label className='font-bold mb-2'>Requirements</label>
                        <p className= 'bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-full' >{jobDetails.title}</p>
                        {/* <input type="text" placeholder='Requirements' value={jobDetails.requirements} className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-full' /> */}
                    </div>


                    <div className='flex flex-col'>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => SetCoverLetter(e.target.value)}
                            placeholder='Cover-Letter' className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 w-full' rows={4}></textarea>
                        <button className='w-full bg-green-600 py-2 rounded-lg shadow-black shadow-md text-white font-semibold hover:bg-green-700'>Submit</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ApplicantForm
