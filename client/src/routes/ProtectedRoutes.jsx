import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export const LoggedInRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>; // or a spinner
    }
    if (user) {
        return children;
    }
    return <Navigate to="/login" replace />
};

export const LoggedOutRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>; // or a spinner
    }
    if (!user) {
        return children;
    }
    return <Navigate to="/dashboard/" replace />
};