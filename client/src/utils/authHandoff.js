// utils/authHandoff.js
import { DB_API, ENDPOINTS } from './api';
import useAuthStore from '../store/authStore';

const EXPO_WEB_URL = import.meta.env.VITE_APP_URL;

export async function sendToExpo(nextPath = '') {
  const { accessToken } = useAuthStore.getState();

  try {
    const res = await fetch(`${DB_API}${ENDPOINTS.createHandoffToken}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to create handoff token:', data.error);
      return false;
    }

    const query = nextPath
    ? `token=${data.handoff_token}&next=${encodeURIComponent(nextPath)}`
    : `token=${data.handoff_token}`;
    window.location.href = `${EXPO_WEB_URL}/handoff?${query}`;
    return true;
  } catch (err) {
    console.error('sendToExpo error:', err);
    return false;
  }
}

// Which profile a user needs to be in each role.
const ROLE_PROFILE_KEYS = {
  reader: 'profile',
  author: 'author_profile',
  free_author: 'free_author_profile',
  moderator: 'moderator_profile',
  admin: 'admin_profile',
};

/**
 * Exchanges an incoming ?handoff=<token> query param for real auth
 * tokens and logs the user in. Call this once on app load/mount.
 *
 * `role` is the role the user was in on Expo (?role=). setAuth puts them
 * in their default role, so switch to the Expo role if they have that
 * profile; otherwise keep the default.
 */
export async function receiveFromExpo(token, role = null) {
  if (!token) return false;

  try {
    const res = await fetch(`${DB_API}${ENDPOINTS.exchangeHandoffToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to exchange handoff token:', data.error);
      return false;
    }

    useAuthStore.getState().setAuth(data.user, data.tokens.access, data.tokens.refresh);

    const profileKey = ROLE_PROFILE_KEYS[role];
    if (profileKey && data.user[profileKey]) {
      useAuthStore.getState().setCurrentRole(role);
    }
    return true;
  } catch (err) {
    console.error('receiveFromExpo error:', err);
    return false;
  }
}