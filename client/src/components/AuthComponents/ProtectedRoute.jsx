import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function ProtectedRoute({ children, requiresVerification = false }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiresVerification && user && !user.is_verified) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
}