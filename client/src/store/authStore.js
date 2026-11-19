import { create } from 'zustand';

const normalizeProfile = (profile, usernameKey) => {
    if (!profile) return null;
    return {
        ...profile,
        username: profile[usernameKey] ?? null
    };
};

const getProfileForRole = (user, role) => {
    if (!user) return null;
    switch (role) {
        case 'author':
            return normalizeProfile(user.author_profile, 'author_username');
        case 'free_author':
            return normalizeProfile(user.free_author_profile, 'author_username');
        case 'moderator':
            return normalizeProfile(user.moderator_profile, 'moderator_username');
        case 'admin':
            return normalizeProfile(user.admin_profile, 'admin_username');
        default:
            return normalizeProfile(user.profile, 'username');
    }
};

const toTitleCase = str => str?.replace(/\b\w/g, c => c.toUpperCase()) ?? null;

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: sessionStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: !!sessionStorage.getItem('access_token') || !!localStorage.getItem('refresh_token'),
    currentRole: localStorage.getItem('current_role') || null,
    currentRoleDisplay: toTitleCase(localStorage.getItem('current_role')),
    currentProfile: null,

    setTokens: (accessToken, refreshToken) => {
        const existingRole = localStorage.getItem('current_role')
        sessionStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)

        set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
            user: null,
            currentRole: existingRole,
            currentRoleDisplay: toTitleCase(existingRole),
            currentProfile: null,
        })

        if (import.meta.env.DEV) {
            console.log('🔑 TOKENS SET — awaiting /me/ for user data')
        }
    },

    setAuth: (user, accessToken, refreshToken) => {
        const role = user.default_login_role
        const profile = getProfileForRole(user, role)
        sessionStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('current_role', role);
        set({ 
            user, 
            accessToken, 
            refreshToken, 
            isAuthenticated: true,
            currentRole: role,
            currentRoleDisplay: toTitleCase(role),
            currentProfile: profile
        });

        if (import.meta.env.DEV) {
            console.log('🔐 AUTH SET:', {
                user,
                currentRole: role,
                currentRoleDisplay: toTitleCase(role),
                currentProfile: profile,
                accessToken,
                refreshToken
            })
        }
    },

    updateUser: (user) => {
        const role = get().currentRole || user.default_login_role
        const profile = getProfileForRole(user, role)
        localStorage.setItem('current_role', role)
        set({ 
            user, 
            currentRole: role,
            currentRoleDisplay: toTitleCase(role),
            currentProfile: profile 
        })

        if (import.meta.env.DEV) {
            console.log('👤 USER UPDATED:', {
                user,
                currentRole: role,
                currentProfile: profile
            })
        }
    },

    // Pass null to drop an expired access token (useUser then refreshes).
    // Pass the rotated refresh token from auth/refresh/ -- the old one is blacklisted.
    updateTokens: (accessToken, refreshToken) => {
        if (accessToken) sessionStorage.setItem('access_token', accessToken);
        else sessionStorage.removeItem('access_token');
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        set({ accessToken, ...(refreshToken && { refreshToken }) });

        if (import.meta.env.DEV) {
            console.log('🔑 TOKENS UPDATED:', { accessToken, refreshToken })
        }
    },

    setCurrentRole: (role) => {
        const user = get().user
        const profile = getProfileForRole(user, role)
        localStorage.setItem('current_role', role);
        set({ currentRole: role, currentRoleDisplay: toTitleCase(role), currentProfile: profile });

        if (import.meta.env.DEV) {
            console.log('🎭 ROLE SWITCHED:', {
                currentRole: role,
                currentRoleDisplay: toTitleCase(role),
                currentProfile: profile
            })
        }
    },

    clearAuth: () => {
        sessionStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_role');
        set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false,
            currentRole: null,
            currentRoleDisplay: null,
            currentProfile: null
        });

        if (import.meta.env.DEV) {
            console.log('🚪 AUTH CLEARED')
        }
    },
}));

export default useAuthStore;