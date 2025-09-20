import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className='flex justify-between items-center px-10 py-5 h-24'>
            <div className='flex justify-around items-center gap-5'>
                <div className="p-1">
                    <img src={logo} className="h-12 w-auto object-contain" alt="Budgeto Logo" />
                </div>
                <div className='text-3xl font-bold'>Budgeto</div>
            </div>
            <div className='flex gap-8 items-center'>
                <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer hover:text-green-600 transition-colors duration-200 text-base"
                    onClick={() => navigate("/features")}
                >
                    Features
                </button>
                <button
                    type="button"
                    className="bg-transparent border-none cursor-pointer hover:text-green-600 transition-colors duration-200 text-base"
                    onClick={() => navigate("/about")}
                >
                    About
                </button>
                <button
                    type="button"
                    className='px-12 py-2.5 bg-green-600 text-white text-lg font-medium rounded-md cursor-pointer hover:bg-green-700 transition-colors duration-200'
                    onClick={() => navigate("/dashboard")}
                >
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default Navbar;