import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "../context/AuthProvider";
// import { LoggedInRoute, LoggedOutRoute } from "./ProtectedRoutes";
// import LandingPage from "../pages/LandingPage";
// import MainLayout from "../layouts/MainLayout";
// import DashLayout from "../layouts/DashLayout";
// import NotFound from "../pages/NotFound";
// import Dashboard from "../pages/Dashboard";
// import Accounts from "../pages/Accounts";
// import Transactions from "../pages/Transactions";
// import Categories from "../pages/Categories";
// import Register from "../pages/Register";
// import Login from "../pages/Login";
// import Logout from "../components/Logout";

// const AppRoutes = () => (
//     <AuthProvider>
//         <Router>
//             <Routes>
//                 <Route path="/" element={<LandingPage />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login"
//                     element={
//                         <LoggedOutRoute>
//                             <Login />
//                         </LoggedOutRoute>
//                     } />
//                 <Route
//                     path="/dashboard/"
//                     element={
//                         <LoggedInRoute>
//                             <Dashboard />
//                         </LoggedInRoute>
//                     }
//                 />
//                 <Route
//                     path="/dashboard/accounts"
//                     element={
//                         <LoggedInRoute>
//                             <Accounts />
//                         </LoggedInRoute>
//                     }
//                 />
//                 <Route
//                     path="/dashboard/transactions"
//                     element={
//                         <LoggedInRoute>
//                             <Transactions />
//                         </LoggedInRoute>
//                     }
//                 />
//                 <Route
//                     path="/dashboard/categories"
//                     element={
//                         <LoggedInRoute>
//                             <Categories />
//                         </LoggedInRoute>
//                     }
//                 />
//                 <Route
//                     path='/logout'
//                     element={
//                         <LoggedInRoute>
//                             <Logout />
//                         </LoggedInRoute>
//                     }
//                 />
//                 <Route path="/dashboard/*" element={<DashLayout><NotFound /></DashLayout>} />
//                 <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
//             </Routes>
//         </Router>
//     </AuthProvider>
// );

import LandingPage from "../features/marketing/LandingPage"
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import Logout from "../features/auth/LogoutPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import AccountsPage from "../features/accounts/AccountsPage";
import NotFound from "../shared/components/NotFound"

import { LoggedInRoute, LoggedOutRoute } from "./ProtectedRoutes";
import { AuthProvider } from "../features/auth/AuthProvider"

const AppRoutes = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={
                    <LoggedOutRoute>
                        <RegisterPage />
                    </LoggedOutRoute>
                } />
                <Route path="/login" element={
                    <LoggedOutRoute>
                        <LoginPage />
                    </LoggedOutRoute>
                } />
                <Route path="/dashboard" element={
                    <LoggedInRoute>
                        <DashboardPage />
                    </LoggedInRoute>
                } />
                <Route path="/dashboard/accounts" element={
                    <LoggedInRoute>
                        <AccountsPage />
                    </LoggedInRoute>
                } />
                <Route path="/logout" element={
                    <LoggedInRoute>
                        <Logout />
                    </LoggedInRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    </AuthProvider>
)
export default AppRoutes;