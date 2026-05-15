import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function ProtectedRoute({ children, requiresVerification = false, allowedRoles }) {

    
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const currentRole = useAuthStore((state) => state.currentRole);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiresVerification && user && !user.is_verified) {
        return <Navigate to="/dashboard" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return children;
}