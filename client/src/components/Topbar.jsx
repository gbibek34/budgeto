import { FiMenu } from "react-icons/fi";

const Topbar = ({ onMenuClick }) => {
    return (
        <header className="w-full h-16 bg-white shadow flex items-center px-6 z-40 sticky top-0">
            <button
                className="mr-4"
                onClick={onMenuClick}
                aria-label="Open sidebar"
            >
                <FiMenu size={28} />
            </button>
            <div className="text-xl font-bold text-green-700">Budgeto Dashboard</div>
        </header>
    );
};

export default Topbar;  