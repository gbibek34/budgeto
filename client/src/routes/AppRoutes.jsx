import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import MainLayout from "../layouts/MainLayout";
import DashLayout from "../layouts/DashLayout";
import NotFound from "../pages/NotFound"
import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import Transactions from "../pages/Transactions"
import Categories from "../pages/Categories";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard/" element={<Dashboard />} />
                <Route path="/dashboard/accounts" element={<Accounts />} />
                <Route path="/dashboard/transactions" element={<Transactions />} />
                <Route path="/dashboard/categories" element={<Categories />} />
                <Route path="/dashboard/*" element={<DashLayout><NotFound /></DashLayout>} />
                <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
        </Router>
    );
}

export default AppRoutes