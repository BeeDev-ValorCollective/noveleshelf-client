import { create } from 'zustand';

const getProfileForRole = (user, role) => {
    if (!user) return null
    switch(role) {
        case 'author':
            return user.author_profile
        case 'free_author':
            return user.free_author_profile
        case 'moderator':
            return user.moderator_profile
        case 'admin':
            return user.admin_profile
        default:
            return user.profile
    }
}

const toTitleCase = str => str?.replace(/\b\w/g, c => c.toUpperCase()) ?? null;

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: sessionStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    isAuthenticated: !!sessionStorage.getItem('access_token') || !!localStorage.getItem('refresh_token'),
    currentRole: localStorage.getItem('current_role') || null,
    currentRoleDisplay: toTitleCase(localStorage.getItem('current_role')),
    currentProfile: null,

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
        const role = get().currentRole
        const profile = getProfileForRole(user, role)
        set({ user, currentProfile: profile });

        if (import.meta.env.DEV) {
            console.log('👤 USER UPDATED:', {
                user,
                currentRole: role,
                currentProfile: profile
            })
        }
    },

    updateAccessToken: (accessToken) => {
        sessionStorage.setItem('access_token', accessToken);
        set({ accessToken });

        if (import.meta.env.DEV) {
            console.log('🔑 ACCESS TOKEN UPDATED:', { accessToken })
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