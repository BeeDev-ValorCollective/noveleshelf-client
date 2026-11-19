import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import { DB_API, ENDPOINTS } from "../utils/api";
import { refreshSession } from "../utils/session";


export default function useUser() {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const refreshToken = useAuthStore((state) => state.refreshToken);
    const updateUser = useAuthStore((state) => state.updateUser);
    const updateTokens = useAuthStore((state) => state.updateTokens);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const fetchUser = async () => {

            // have access token - just fetch user
            if (!user && accessToken) {
                try {
                    const response = await fetch(`${DB_API}${ENDPOINTS.me}`, {
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
                        // Expired access token -- drop it so the refresh branch runs
                        if (refreshToken) updateTokens(null);
                        else clearAuth();
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

                    // Shared with the fetch wrapper so only one refresh runs at a time.
                    // On success it saves both tokens (the old refresh token is now
                    // blacklisted); the new access token re-runs this effect, which
                    // fetches /me/. On an invalid refresh token it clears auth itself.
                    const newAccess = await refreshSession();

                    if (import.meta.env.DEV) {
                        console.log(newAccess
                            ? '🔑 TOKEN REFRESHED SUCCESSFULLY'
                            : '❌ REFRESH TOKEN EXPIRED — AUTH CLEARED')
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    clearAuth();
                }
            }
        };

        fetchUser();
    }, [user, accessToken, refreshToken, updateUser, updateTokens, clearAuth]);

    return { user, accessToken };
}