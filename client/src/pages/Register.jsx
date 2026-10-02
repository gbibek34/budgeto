import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from "../layouts/MainLayout"
import { registerUser } from "../services/auth";
import registerimg from "../assets/register.png";


const Register = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        email: '',
        username: '',
        password: '',
        cpassword: '',
        first_name: '',
        last_name: '',
        phone_number: ''
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

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Invalid email format');
            return;
        }
        // Password length validation
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        // Password match validation
        if (form.password !== form.cpassword) {
            setError('Passwords do not match');
            return;
        }
        // First and last name required
        if (!form.first_name.trim() || !form.last_name.trim()) {
            setError('First name and last name are required');
            return;
        }
        try {
            const res = await registerUser(form);
            login(res.token)
            setSuccess(res.message || 'Registration successful!');
            setError('');
            setForm({
                email: '',
                username: '',
                password: '',
                cpassword: '',
                first_name: '',
                last_name: '',
                phone_number: ''
            });
            navigate("/dashboard")
        } catch (e) {
            setError(e.response?.data?.error || e.message || 'Registration failed');
            setSuccess('');
        }
    }

    return (
        <MainLayout>
            <div className="flex flex-col w-full lg:flex-row py-5">
                {/* Right: Image Placeholder */}
                <div className="hidden lg:flex flex-1 items-center justify-center">
                    {/* Replace the div below with your image later */}
                    <div className="w-3/4 h-3/4 rounded-xl flex items-center justify-center shadow-inner">
                        <img src={registerimg} alt="Registration Image" />
                    </div>
                </div>
                {/* Left: Form */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-fit bg-white rounded-xl shadow-lg p-10">
                        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Create Your Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
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
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="cpassword"
                                    value={form.cpassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-green-800 font-medium mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-green-800 font-medium mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-green-800 font-medium mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={form.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors duration-200 shadow cursor-pointer"
                            >
                                Register
                            </button>
                            {error && <div className="text-red-600 text-center mt-2">{error}</div>}
                            {success && <div className="text-green-600 text-center mt-2">{success}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Register