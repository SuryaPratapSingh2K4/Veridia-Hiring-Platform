import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/");
    }
    const isLoginPage = location.pathname === '/';
    const isRegisterPage = location.pathname === '/register';
    const handleBoard = () => {
        if (role === 'admin') navigate('/admin');
        else navigate('/user');
    }
    return (
        <nav className='top-0 left-0 w-full fixed bg-gray-300 shadow-sm'>
            <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
                <Link to={handleBoard} className='text-2xl text-center font-bold'>
                    Veridia Hiring
                </Link>
                <div className='flex'>
                    {!role && (
                        <>
                            {isLoginPage && <button onClick={() => navigate("/register")} className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>SignUp</button>}
                        </>
                    )}

                    {!role && (
                        <>
                            {isRegisterPage && <button onClick={() => navigate("/")} className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>Login</button>}
                        </>
                    )}

                    {role === "admin" && (
                        <div className='flex gap-4'>
                            <Link to='/admin' className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>Dashboard</Link>
                            <Link to='/admin/post-job' className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>
                                Post Job
                            </Link>
                            <Link to='/admin/applicants' className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>
                                Applicants
                            </Link>
                        </div>


                    )}

                    {role === "user" && (
                        <div className='flex gap-4'>
                            <Link to='/user' className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>Jobs</Link>
                            <Link to='/user/my-applications' className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold'>
                                My Applications
                            </Link>
                        </div>
                    )}
                </div>
                <div>
                    <button onClick={handleLogOut} className='px-4 border bg-white py-1 rounded-lg shadow-sm shadow-black hover:bg-slate-300 font-semibold text-red-600'>LogOut</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
