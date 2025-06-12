import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Facebook, Twitter, Github, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (!acceptTerms) {
            alert("Please accept the terms and conditions");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Signup with:", formData);
            alert("Account created successfully! 🎉");
            setIsLoading(false);
        }, 1000);
    };

    const passwordStrength = () => {
        const password = formData.password;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthText = () => {
        const strength = passwordStrength();
        if (strength === 0) return { text: "", color: "" };
        if (strength === 1) return { text: "Weak", color: "text-red-500" };
        if (strength === 2) return { text: "Fair", color: "text-yellow-500" };
        if (strength === 3) return { text: "Good", color: "text-blue-500" };
        return { text: "Strong", color: "text-green-500" };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-slate-700" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-300 text-sm">Join us and start your journey today</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8">
                        {/* Social Signup */}
                        <div className="flex justify-center gap-4 mb-8">
                            <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-slate-600 hover:bg-slate-50 transition-all duration-200 group">
                                <Facebook className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                            </button>
                            <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-slate-600 hover:bg-slate-50 transition-all duration-200 group">
                                <Twitter className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                            </button>
                            <button className="p-3 border-2 border-slate-200 rounded-xl hover:border-slate-600 hover:bg-slate-50 transition-all duration-200 group">
                                <Github className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500 font-medium">
                                    Or create with email
                                </span>
                            </div>
                        </div>

                        {/* Signup Form */}
                        <div className="space-y-5">
                            {/* Username Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Choose a username"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${passwordStrength() === 1 ? 'w-1/4 bg-red-500' :
                                                        passwordStrength() === 2 ? 'w-2/4 bg-yellow-500' :
                                                            passwordStrength() === 3 ? 'w-3/4 bg-blue-500' :
                                                                passwordStrength() === 4 ? 'w-full bg-green-500' : 'w-0'
                                                        }`}
                                                ></div>
                                            </div>
                                            <span className={`text-xs font-medium ${getStrengthText().color}`}>
                                                {getStrengthText().text}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-slate-600 focus:outline-none transition-all duration-200 text-slate-700 placeholder-slate-400"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Password Match Indicator */}
                                {formData.confirmPassword && (
                                    <div className="mt-2 flex items-center gap-2">
                                        {formData.password === formData.confirmPassword ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span className="text-xs text-green-600 font-medium">Passwords match</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-red-500 font-medium">Passwords don't match</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAcceptTerms(!acceptTerms)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${acceptTerms
                                        ? 'bg-slate-800 border-slate-800'
                                        : 'border-slate-300 hover:border-slate-400'
                                        }`}
                                >
                                    {acceptTerms && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className="text-sm text-slate-600 leading-relaxed">
                                    I agree to the{" "}
                                    <button className="text-slate-800 hover:text-slate-600 font-medium underline">
                                        Terms of Service
                                    </button>{" "}
                                    and{" "}
                                    <button className="text-slate-800 hover:text-slate-600 font-medium underline">
                                        Privacy Policy
                                    </button>
                                </span>
                            </div>

                            {/* Signup Button */}
                            <button
                                onClick={handleSignup}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white py-4 rounded-xl font-semibold hover:from-slate-900 hover:to-slate-800 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>

                        {/* Switch to Login */}
                        <div className="text-center mt-8 pt-6 border-t border-slate-100">
                            <span className="text-slate-600 text-sm">Already have an account? </span>
                            <button
                                onClick={() => navigate("/")}
                                className="text-slate-800 hover:text-slate-600 font-semibold text-sm transition-colors duration-200"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;