import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !phone || !password || !retypePassword) {
            toast.error("All fields are required");
            return;
        }
        if (password !== retypePassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register',
                {
                    'name': username,
                    'mobile': phone,
                    'password': password
                },
                { withCredentials: true },
            )
            if (response.status == 200) {
                toast.success("Account created succesfully!");
                navigate('/');
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! please try again later")
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center">
            <div className="w-72 border border-zinc-600 rounded-md overflow-hidden shadow-xl bg-white flex flex-col gap-2">

                {/* Traffic lights */}
                <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                </div>

                {/* Header */}
                <div className="bg-blue-500 flex justify-center items-center text-white text-center py-3 text-sm font-semibold tracking-wide h-10">
                    Member Management System
                </div>

                <form onSubmit={handleSubmit} className="bg-white px-6 py-6 flex flex-col gap-4">

                    {/* Username */}
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="text-sm text-gray-600 outline-none w-full placeholder-gray-400 h-7"
                        />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                        </svg>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone number"
                            className="text-sm text-gray-600 outline-none w-full placeholder-gray-400 h-7"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 relative">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-9H9V6a3 3 0 0 1 6 0v2z" />
                        </svg>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="text-sm text-gray-600 outline-none w-full placeholder-gray-400 h-7"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-500"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.164.203-2.276.575-3.29M6.18 6.18A9.953 9.953 0 0112 5c5 0 9 4 9 9 0 1.164-.203 2.276-.575 3.29M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Retype Password */}
                    <div className="flex items-center border border-gray-300 rounded px-3 py-2 gap-2 relative">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-9H9V6a3 3 0 0 1 6 0v2z" />
                        </svg>
                        <input
                            type={showRetypePassword ? "text" : "password"}
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                            placeholder="Retype password"
                            className="text-sm text-gray-600 outline-none w-full placeholder-gray-400 h-7"
                        />
                        <button
                            type="button"
                            onClick={() => setShowRetypePassword(!showRetypePassword)}
                            className="absolute right-3 text-gray-500"
                        >
                            {showRetypePassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9 0-1.164.203-2.276.575-3.29M6.18 6.18A9.953 9.953 0 0112 5c5 0 9 4 9 9 0 1.164-.203 2.276-.575 3.29M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Already have account */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="text-blue-600 hover:text-blue-700 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
                            >
                                Login
                            </button>
                        </span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded transition-colors duration-150 w-full h-8"
                    >
                        Create account
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Register;