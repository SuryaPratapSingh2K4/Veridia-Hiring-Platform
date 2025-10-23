import React from 'react'
import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom';

function Navbar() {
    // const role = localStorage.getItem("role");
    // const navigate = useNavigate();
    return (
        <nav className='navbar bg-base-100 shadow-sm'>
            <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
                <Link to='/' className='text-xl font-bold'>
                    Veridia Hiring
                </Link>
            </div>
        </nav>
    )
}

export default Navbar
