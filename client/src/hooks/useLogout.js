import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const DB_API = `${import.meta.env.VITE_DB_API}`

export default function useLogout() {
    const navigate = useNavigate();
    const { refreshToken, clearAuth } = useAuthStore();

    const logout = async () => {
        try {
            await fetch(DB_API + 'auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuthStore.getState().accessToken}`
                },
                body: JSON.stringify({
                    refresh: refreshToken
                })
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // always clear auth and redirect even if API call fails
            clearAuth();
            navigate('/login');
        }
    };

    return { logout };
}