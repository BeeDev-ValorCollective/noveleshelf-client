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

    const query = nextPath ? `token=${data.handoff_token}&next=${nextPath}` : `token=${data.handoff_token}`;
    window.location.href = `${EXPO_WEB_URL}/handoff?${query}`;
    return true;
  } catch (err) {
    console.error('sendToExpo error:', err);
    return false;
  }
}

/**
 * Exchanges an incoming ?handoff=<token> query param for real auth
 * tokens and logs the user in. Call this once on app load/mount.
 */
export async function receiveFromExpo(token) {
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
    return true;
  } catch (err) {
    console.error('receiveFromExpo error:', err);
    return false;
  }
}