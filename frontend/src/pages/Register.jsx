import React, { useState } from 'react'
import { FaRegEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState("user");
    const togglePassword = () => setIsShowPassword(!isShowPassword);
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("http://localhost:7000/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password, role })
            })
            const data = res.json();
            if (!res.ok) return alert(data.message);
            alert("Registered Successfully!");
            navigate("/");
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="bg-gray-200 px-7 py-10 rounded w-96 shadow-md">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <h4 className="text-2xl mb-4 font-bold">Sign Up</h4>

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full py-2 rounded-lg px-2 shadow-sm"
                    />

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

                    <select className='w-full py-2 rounded-lg px-2 shadow-sm' value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>

                    <button className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    <h4 className="text-center">
                        Already have an account.{' '}
                        <Link to="/" className="underline font-bold">
                            Login Here
                        </Link>
                    </h4>
                </form>
            </div>
        </div>
    )
}

export default Register
