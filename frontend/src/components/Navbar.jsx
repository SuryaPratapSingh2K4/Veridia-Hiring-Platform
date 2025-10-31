import React from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        toast.success("Successfully Logged-Out")
        navigate("/");
    }
    const isLoginPage = location.pathname === '/';
    const isRegisterPage = location.pathname === '/register';
    const handleBoard = () => {
        if (role === 'admin') navigate('/admin');
        else navigate('/user');
    }
    return (
        <nav className='top-0 left-0 w-full fixed bg-black shadow-sm'>
            <div className='max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-4 flex md:flex-nowrap items-center justify-between gap-1 sm:gap-0'>
                <Link to={handleBoard} className='text-2xl text-center font-bold text-white'>
                    Veridia Hiring
                </Link>
                <div className='flex'>
                    {!role && (
                        <>
                            {isLoginPage && <button onClick={() => navigate("/register")} className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold '>SignUp</button>}
                        </>
                    )}

                    {!role && (
                        <>
                            {isRegisterPage && <button onClick={() => navigate("/")} className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold '>Login</button>}
                        </>
                    )}

                    {role === "admin" && (
                        <div className='flex gap-2'>
                            <Link to='/admin' className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold '>Dashboard</Link>
                            <Link to='/admin/post-job' className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold'>
                                Post Job
                            </Link>
                            <Link to='/admin/applicants' className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white font-semibold hover:shadow-white '>
                                Applicants
                            </Link>
                            <button onClick={handleLogOut} className='px-4 bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 font-semibold hover:font-bold text-red-600 hover:shadow-white '>LogOut</button>
                        </div>


                    )}

                    {role === "user" && (
                        <div className='flex gap-4 md:[gap-2]'>
                            <Link to='/user' className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold '>Jobs</Link>
                            <Link to='/user/my-applications' className='px-4  bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 hover:text-white hover:shadow-white font-semibold '>
                                My Applications
                            </Link>
                            <button onClick={handleLogOut} className='px-4 bg-white py-1 rounded-lg shadow-md shadow-black hover:bg-gradient-to-br from-purple-900 via-black to-indigo-900 font-semibold hover:font-bold text-red-600 hover:shadow-white '>LogOut</button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    )
}

export default Navbar
