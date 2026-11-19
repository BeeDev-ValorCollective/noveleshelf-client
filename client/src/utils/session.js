import useAuthStore from '../store/authStore';
import { DB_API, ENDPOINTS } from './api';

const REFRESH_URL = `${DB_API}auth/refresh/`;

// Requests that never need a token refresh.
const AUTH_ENDPOINTS = [
    ENDPOINTS.login,
    ENDPOINTS.logout,
    ENDPOINTS.signup,
    'auth/refresh/',
    ENDPOINTS.createHandoffToken,
    ENDPOINTS.exchangeHandoffToken,
].map((path) => `${DB_API}${path}`);

const nativeFetch = window.fetch.bind(window);

let refreshPromise = null;
let installed = false;

const isAuthEndpoint = (url) =>
    AUTH_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));

async function requestRefresh(refreshToken) {
    const response = await nativeFetch(REFRESH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Platform': 'vite',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.status === 400 || response.status === 401) {
        return null;
    }
    if (!response.ok) {
        throw new Error(`Token refresh failed: HTTP ${response.status}`);
    }
    return response.json();
}

// Single shared refresh. Concurrent callers wait on the same request, because
// the server blacklists a refresh token once it has been used (rotation).
// Returns the new access token, or null if the session is no longer valid.
// Throws on network/server errors so callers can decide what to do.
export function refreshSession() {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        // localStorage is the source of truth: another tab may have
        // rotated the refresh token since this tab loaded.
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            useAuthStore.getState().clearAuth();
            return null;
        }

        let data = await requestRefresh(refreshToken);

        // Rejected, but another tab rotated the token mid-request -- try the new one.
        const latest = localStorage.getItem('refresh_token');
        if (!data && latest && latest !== refreshToken) {
            data = await requestRefresh(latest);
        }

        if (!data?.access) {
            useAuthStore.getState().clearAuth();
            return null;
        }

        useAuthStore.getState().updateTokens(data.access, data.refresh);
        return data.access;
    })();

    return refreshPromise.finally(() => {
        refreshPromise = null;
    });
}

// Wraps window.fetch once:
// - tags every request with X-Client-Platform: vite
// - on a 401 for a Bearer request, refreshes the token and retries once
export function installAuthenticatedFetch() {
    if (installed) return;
    installed = true;

    window.fetch = async (input, options = {}) => {
        const url = typeof input === 'string' ? input : input?.url || '';
        const headers = new Headers(options.headers || {});
        headers.set('X-Client-Platform', 'vite');

        const authorization = headers.get('Authorization');
        if (!authorization?.startsWith('Bearer ') || isAuthEndpoint(url)) {
            return nativeFetch(input, { ...options, headers });
        }

        // If a refresh already happened since this request was built, use the new token.
        const current = useAuthStore.getState().accessToken;
        if (current && authorization.slice(7) !== current) {
            headers.set('Authorization', `Bearer ${current}`);
        }

        const response = await nativeFetch(input, { ...options, headers });
        if (response.status !== 401) return response;

        try {
            const accessToken = await refreshSession();
            if (!accessToken) return response;

            headers.set('Authorization', `Bearer ${accessToken}`);
            return await nativeFetch(input, { ...options, headers });
        } catch (error) {
            // Network/server error during refresh -- hand back the original 401.
            console.error('Token refresh unavailable:', error);
            return response;
        }
    };
}
