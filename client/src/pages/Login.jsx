import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from "../layouts/MainLayout"
import { loginUser } from "../services/auth";
import loginimg from "../assets/login.png";


const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Password length validation
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        try {
            const res = await loginUser(form);
            login(res.token, res.user)
            setSuccess(res.message || 'Login successful!');
            setError('');
            setForm({ username: '', password: '' });
            navigate("/dashboard")
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Login failed');
            setSuccess('');
        }
    }

    return (
        <MainLayout>
            <div className="flex flex-col lg:flex-row w-full h-full min-h-0">
                {/* Left: Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10 flex flex-col items-center">
                        <h2 className="text-3xl font-bold text-green-700 mb-2 text-center">Welcome Back!</h2>
                        <p className="text-green-800 mb-6 text-center">
                            Log in to access your dashboard and manage your budget efficiently.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6 w-full">
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                                />
                            </div>
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200 shadow"
                            >
                                Log In
                            </button>
                            {error && <div className="text-red-600 text-center mt-2">{error}</div>}
                            {success && <div className="text-green-600 text-center mt-2">{success}</div>}
                        </form>
                        <div className="mt-8 w-full flex flex-col items-center">
                            <div className="w-full h-px bg-green-100 mb-4"></div>
                            <p className="text-green-700">
                                Don't have an account?{" "}
                                <span
                                    className="text-green-600 hover:underline cursor-pointer"
                                    onClick={() => window.location.href = '/register'}
                                >
                                    Sign Up
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Right: Illustration */}
                <div className="hidden lg:flex flex-1 items-center justify-center">
                    <div className="w-3/4 h-3/4 flex items-center justify-center">
                        <img src={loginimg} alt="" />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Login