import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { DB_API, ENDPOINTS } from '../utils/api'


export default function useLogout() {
    const navigate = useNavigate();
    const { refreshToken, clearAuth } = useAuthStore();

    const logout = async () => {
        try {
            await fetch(`${DB_API}${ENDPOINTS.logout}`, {
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
            if (import.meta.env.DEV) {
                console.log('🚪 LOGGED OUT')
            }
            clearAuth();
            navigate('/');
        }
    };

    return { logout };
}