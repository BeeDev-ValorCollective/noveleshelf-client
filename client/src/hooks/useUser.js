import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const DB_API = `${import.meta.env.VITE_DB_API}`

export default function useUser() {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const updateUser = useAuthStore((state) => state.updateUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user && accessToken) {
                try {
                    const response = await fetch(DB_API + 'auth/me/', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        updateUser(data);
                    } else if (response.status === 401) {
                        // token expired or invalid - clear auth and redirect to login
                        clearAuth();
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };

        fetchUser();
    }, [user, accessToken, updateUser, clearAuth]);

    return { user, accessToken };
}