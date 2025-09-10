// src/pages/Login.jsx
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const Login = () => {
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(number)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!password) {
            alert("Please enter password.");
            return;
        }

        setIsLoading(true);
        try {
            // Send JSON; backend also supports urlencoded
            const { data } = await api.post("/api/auth/login", {
                number,
                password,
            });

            if (data?.success && data?.token) {
                // Save token + user
                localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }));
                navigate("/home");
            } else {
                alert(data?.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert(error?.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-300 text-sm">Sign in to continue to your account</p>
                    </div>

                    <div className="px-8 py-8">
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Enter your number"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <button type="button" className="text-sm text-slate-600 hover:text-slate-800 font-medium">
                                    Forgot your password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-4 rounded-xl font-semibold hover:from-slate-900 hover:to-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-700 text-center">
                        <span className="font-semibold text-slate-800">Demo Login:</span><br />
                        <span className="font-mono text-slate-600">number: 9898989898</span><br />
                        <span className="font-mono text-slate-600">password: admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
