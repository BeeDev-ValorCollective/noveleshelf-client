import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    accessToken: sessionStorage.getItem('access_token') || null,
    refreshToken: sessionStorage.getItem('refresh_token') || null,
    isAuthenticated: !!sessionStorage.getItem('access_token'),

    setAuth: (user, accessToken, refreshToken) => {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('refresh_token', refreshToken);
        set({ 
            user, 
            accessToken, 
            refreshToken, 
            isAuthenticated: true 
        });
    },

    updateUser: (user) => {
        set({ user });
    },

    updateAccessToken: (accessToken) => {
        sessionStorage.setItem('access_token', accessToken);
        set({ accessToken });
    },

    clearAuth: () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false 
        });
    },
}));

export default useAuthStore;