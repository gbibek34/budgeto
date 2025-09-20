import { NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";

const navLinks = [
    { to: "/dashboard", label: "Overview", icon: "🏠", end: true },
    { to: "/dashboard/accounts", label: "Accounts", icon: "💳" },
    { to: "/dashboard/categories", label: "Category", icon: "🌿" },
    { to: "/dashboard/transactions", label: "Transactions", icon: "💸" },
    { to: "/dashboard/budgets", label: "Budgets", icon: "📊" },
    { to: "/dashboard/goals", label: "Saving Goals", icon: "🎯" },
    // Add more links as needed
];

const Sidebar = ({ collapsed, mobile, onClose }) => {
    return (
        <aside
            className={`
                bg-white shadow-lg flex flex-col justify-between
                ${collapsed ? "w-20" : "w-64"}
                ${mobile
                    ? "fixed top-0 left-0 h-full w-full"
                    : "hidden md:flex sticky top-16 h-[calc(100vh-4rem)]"}
                transition-all duration-300`}
        >
            {/* Close button for mobile */}
            {mobile && (
                <button
                    className="self-end m-4 text-2xl"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <FiX />
                </button>
            )}
            <nav className="flex flex-col gap-2 px-2 mt-4">
                {navLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${isActive
                                ? "bg-green-100 text-green-700 font-semibold shadow"
                                : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                            }`
                        }
                        onClick={mobile ? onClose : undefined}
                    >
                        <span className="text-xl">{link.icon}</span>
                        {!collapsed && <span>{link.label}</span>}
                    </NavLink>
                ))}
            </nav>
            <div className="px-4 py-6 text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Budgeto
            </div>
        </aside>
    );
};

export default Sidebar;