import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const DB_API = `${import.meta.env.VITE_DB_API}`

export default function useUser() {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const updateUser = useAuthStore((state) => state.updateUser);
    const updateAccessToken = useAuthStore((state) => state.updateAccessToken);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const fetchUser = async () => {

            // have access token - just fetch user
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

                        if (import.meta.env.DEV) {
                            console.log('👤 USER REHYDRATED FROM /me/:', data)
                        }

                    } else if (response.status === 401) {
                        clearAuth();
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }

            // no access token but have refresh token - try to refresh
            if (!accessToken && refreshToken) {
                try {
                    if (import.meta.env.DEV) {
                        console.log('🔄 NO ACCESS TOKEN — ATTEMPTING REFRESH...')
                    }

                    const response = await fetch(DB_API + 'auth/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: refreshToken })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        updateAccessToken(data.access);

                        if (import.meta.env.DEV) {
                            console.log('🔑 TOKEN REFRESHED SUCCESSFULLY')
                        }

                        // now fetch user with new access token
                        const userResponse = await fetch(DB_API + 'auth/me/', {
                            headers: {
                                'Authorization': `Bearer ${data.access}`
                            }
                        });

                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            updateUser(userData);

                            if (import.meta.env.DEV) {
                                console.log('👤 USER REHYDRATED AFTER REFRESH:', userData)
                            }
                        }
                    } else {
                        // refresh token expired - clear everything
                        if (import.meta.env.DEV) {
                            console.log('❌ REFRESH TOKEN EXPIRED — CLEARING AUTH')
                        }
                        clearAuth();
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    clearAuth();
                }
            }
        };

        fetchUser();
    }, [user, accessToken, refreshToken, updateUser, updateAccessToken, clearAuth]);

    return { user, accessToken };
}