import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom'

function ApplicantForm() {
    const { id } = useParams();
    const [coverLetter, SetCoverLetter] = useState("");
    const [file, setFile] = useState();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [jobDetails, setJobDetails] = useState([]);
    const handleApply = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("jobId", id);
        formData.append("coverLetter", coverLetter);
        formData.append("resume", file);  // ✅ only this

        try {
            const res = await fetch("http://localhost:7000/api/application/apply", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // ❌ no "Content-Type"
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) return alert(data.message || "Failed to apply");
            toast.success("Successfully applied for the job");
            navigate("/user");
        } catch (error) {
            console.error(error.message);
        }
    };


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
        } finally {
            setLoading(false);
        }
    }, [id, token])
    return (
        <div className='p-8'>
            <div className='mt-12 flex flex-col items-center gap-4'>
                <h1 className="underline font-bold text-2xl">Apply for Job</h1>
                {loading && <div className="flex text-3xl font-bold mt-20">Loading....</div>}
                <form onSubmit={handleApply} className='flex flex-col w-full max-w-lg shadow-black border p-8 rounded-lg shadow-sm'>

                    <label className='font-bold mb-2'>Recruitment Title : <span className='font-normal'>{jobDetails.title}</span></label>

                    <label className='font-bold mb-2'>Company Name : <span className='font-normal'>{jobDetails.company}</span></label>

                    <label className='font-bold mb-2'>Location : <span className='font-normal'>{jobDetails.location}</span></label>

                    <label className='font-bold mb-2'>Job-Type : <span className='font-normal'>{jobDetails.type}</span></label>

                    <label className='font-bold mb-2'>Resume : <input type="file" name='resume' accept='.pdf, .doc, .docx' onChange={(e) => setFile(e.target.files[0])} /></label>

                    <textarea
                        value={coverLetter}
                        onChange={(e) => SetCoverLetter(e.target.value)}
                        placeholder='Cover-Letter' className='input bg-slate-50 text-black shadow-sm shadow-black rounded-lg py-2 px-4 mt-2 mb-4 w-full' rows={4}></textarea>
                    <button className='w-full bg-green-600 py-2 rounded-lg shadow-black shadow-md text-white font-semibold hover:bg-green-700'>Submit</button>


                </form>
            </div>
        </div>
    )
}

export default ApplicantForm
