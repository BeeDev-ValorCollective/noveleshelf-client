// hooks/useAuthHandoffListener.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { receiveFromExpo } from '../utils/authHandoff';

export function useAuthHandoffListener() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('handoff');
    if (!token) return;

    (async () => {
      const success = await receiveFromExpo(token);

      // Strip the handoff param either way -- can't be reused/bookmarked
      params.delete('handoff');
      const cleanSearch = params.toString();
      const cleanPath = `${location.pathname}${cleanSearch ? `?${cleanSearch}` : ''}`;

      navigate(success ? cleanPath : '/login', { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
}