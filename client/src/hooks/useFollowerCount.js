import { useCallback, useEffect, useState } from 'react';

import useAuthStore from '../store/authStore';
import { DB_API, ENDPOINTS } from '../utils/api';

export default function useFollowerCount(profileType) {
    const accessToken = useAuthStore((state) => state.accessToken);

    const [followerCount, setFollowerCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFollowerCount = useCallback(async () => {
        if (!accessToken || !profileType) {
            setFollowerCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.author.stats(profileType)}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error('Unable to load follower count:', data);
                setError(data);
                setFollowerCount(0);
                return;
            }

            setFollowerCount(Number(data.follower_count ?? 0));
        } catch (err) {
            console.error('Follower count request failed:', err);
            setError(err);
            setFollowerCount(0);
        } finally {
            setLoading(false);
        }
    }, [accessToken, profileType]);

    useEffect(() => {
        fetchFollowerCount();
    }, [fetchFollowerCount]);

    return {
        followerCount,
        loading,
        error,
        refetch: fetchFollowerCount,
    };
}