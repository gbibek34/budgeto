import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoggedInRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // or a spinner
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children;
};

export const LoggedOutRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // or a spinner
    if (user) {
        return <Navigate to="/dashboard/" replace />
    }
    return children;
};