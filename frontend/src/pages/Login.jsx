import React, { useState } from 'react';
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
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json();
            if (!res.ok) return alert(data.message);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login Successfully");
            if (data.user.role === 'admin') return navigate('/admin');
            else navigate("/user");
            res.status(201).json(data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="bg-gray-200 px-7 py-10 rounded w-96 shadow-md">
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <h4 className="text-2xl mb-4 font-bold">Login</h4>

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full py-2 rounded-lg px-2 shadow-sm"
                    />

                    <div className="relative">
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-2 rounded-lg px-2 shadow-sm"
                        />

                        <FaRegEye
                            size={22}
                            className="absolute right-3 top-2 cursor-pointer text-blue-400"
                            onClick={togglePassword}
                        />
                    </div>

                    <button className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <h4 className="text-center">
                        Not registered yet?{' '}
                        <Link to="/register" className="underline font-bold">
                            Create an Account
                        </Link>
                    </h4>
                </form>
            </div>
        </div>
    );
}

export default Login;
