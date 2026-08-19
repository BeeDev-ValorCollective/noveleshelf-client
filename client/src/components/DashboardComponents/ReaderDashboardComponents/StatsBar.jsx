import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import useAuthStore from '../../../store/authStore'
import '../ReaderDashboardComponents/readerDashboard.css';

const LOGIN_BONUS_BADGES = {
    91: {
        title: '91-Day Bonus',
        reward: 25,
    },
    182: {
        title: '182-Day Bonus',
        reward: 50,
    },
    273: {
        title: '273-Day Bonus',
        reward: 75,
    },
    365: {
        title: 'Yearly Login Bonus',
        reward: 100,
    },
};

const getLoginPatternDay = (streakDay) => {
    if (!streakDay || streakDay < 1) {
        return null;
    }

    return ((streakDay - 1) % 365) + 1;
};
export default function RenderStatsBar({ onBonusBadgeChange }) {
    const accessToken = useAuthStore((state) => state.accessToken)
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch(
                `${DB_API}${ENDPOINTS.readerStats}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (res.ok) {
                const data = await res.json()

                setStats(data)

                // ─── Login Bonus Badge ─────────────────────
                const loginStreak =
                    data?.login_streak ?? 0

                const patternDay =
                    getLoginPatternDay(loginStreak)

                const badge =
                    LOGIN_BONUS_BADGES[patternDay] ?? null

                console.log('VITE LOGIN BADGE:', {
                    loginStreak,
                    patternDay,
                    badge,
                })

                onBonusBadgeChange?.(badge)
                // ─── End Login Bonus Badge ─────────────────
            } else {
                console.error(
                    'Failed to load reader stats:',
                    res.status
                )
            }

        } catch (err) {
            console.error(
                'Failed to load reader stats:',
                err
            )
        } finally {
            setIsLoading(false)
        }
    }

    fetchStats()

}, [accessToken, onBonusBadgeChange])

    if (isLoading || !stats) return null

    return (
        <section className='reader-section'>
            <div className='reader-stats-grid'>

                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Login Streak</p>
                    <h2 className='reader-stat-value'>{stats.login_streak}</h2>
                </div>
                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Reading Streak</p>
                    <h2 className='reader-stat-value'>{stats.reading_streak}</h2>
                </div>
                {/* <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Average Rating</p>
                    <h2 className='reader-stat-value'>4.3</h2>
                </div> */}
            </div>
        </section>
    );
}