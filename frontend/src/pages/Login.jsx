import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaRegEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const togglePassword = () => setIsShowPassword(!isShowPassword);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:7000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) return alert(data.message);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Successfully Logged In');

            if (data.user.role === 'admin') return navigate('/admin');
            else navigate('/user');
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white">
            {/* Left Section - Welcome Content */}
            <div className="md:w-1/2 w-full px-10 md:px-16 py-10 text-center md:text-left pt-20">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Welcome to <span className="text-purple-500">Veridia Hiring</span>
                </h1>
                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                    Where <span className="font-semibold text-white">Talent Meets Opportunity</span> 🚀
                    <br /> Log in to explore jobs, manage applications, and take the next
                    step in your professional journey.
                </p>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto md:mx-0">
                    <div>
                        <h2 className="text-3xl font-bold text-purple-500">120+</h2>
                        <p className="text-sm text-gray-400">Hiring Companies</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-purple-500">7,500+</h2>
                        <p className="text-sm text-gray-400">Active Job Seekers</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-purple-500">25,000+</h2>
                        <p className="text-sm text-gray-400">Applications Processed</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-purple-500">92%</h2>
                        <p className="text-sm text-gray-400">Employer Satisfaction</p>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="md:w-1/3 w-[90%] bg-white text-gray-800 rounded-2xl shadow-2xl p-8 mx-auto md:mr-16 my-10 md:my-0">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
                    Login to Your Account
                </h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                    <div className="relative">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <FaRegEye
                            size={22}
                            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer hover:text-purple-600"
                            onClick={togglePassword}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition-all"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-2">
                        Not registered yet?{' '}
                        <Link to="/register" className="text-purple-700 font-semibold hover:underline">
                            Create an Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>


    )
}

export default Login;
