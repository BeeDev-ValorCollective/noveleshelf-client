import { useCallback, useEffect, useState } from 'react';
import { Users } from 'lucide-react';

import useAuthStore from '../../../store/authStore';
import {
    DB_API,
    ENDPOINTS,
} from '../../../utils/api';

export default function FollowerCount({
    profileType,
}) {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const [followerCount, setFollowerCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const fetchFollowerCount = useCallback(
        async () => {
            if (!accessToken || !profileType) {
                setFollowerCount(0);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(
                    `${DB_API}${ENDPOINTS.author.stats(
                        profileType
                    )}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${accessToken}`,
                        },
                    }
                );

                const data = await response
                    .json()
                    .catch(() => ({}));

                if (!response.ok) {
                    console.error(
                        'Unable to load follower count:',
                        data
                    );

                    setFollowerCount(0);
                    return;
                }

                setFollowerCount(
                    Number(
                        data.follower_count ?? 0
                    )
                );
            } catch (error) {
                console.error(
                    'Follower count request failed:',
                    error
                );

                setFollowerCount(0);
            } finally {
                setLoading(false);
            }
        },
        [accessToken, profileType]
    );

    useEffect(() => {
        fetchFollowerCount();
    }, [fetchFollowerCount]);

    return (
        <div className='stat-item dashboard-card'>
            <p className='stat-label'>
                {followerCount === 1
                    ? 'Follower'
                    : 'Followers'}
            </p>

            <h2 className='stat-value'>
                {loading ? '-' : followerCount}
            </h2>
        </div>
    );
}