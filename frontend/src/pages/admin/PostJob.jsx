import React, { useState } from 'react'

function PostJob() {
    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("Full-Time");
    const [description, setDescription] = useState("");
    const [requirements, setRequirements] = useState("");
    const handleCreate = async (e) => {
        e.preventDefault();
    }
    return (
        <div className='p-8' >
            <div className='mt-12 flex flex-col items-center gap-4'>
                <h1 className='items-center underline font-bold text-2xl'>Create a Job Post</h1>
                <form onSubmit={handleCreate}>
                    <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} className='px-20 py-2 bg-slate-50 text-black shadow-sm shadow-black rounded-lg' />
                </form>
            </div>
        </div>
    )
}

export default PostJob
