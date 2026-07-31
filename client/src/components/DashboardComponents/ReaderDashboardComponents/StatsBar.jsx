import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import useAuthStore from '../../../store/authStore'
import '../ReaderDashboardComponents/readerDashboard.css';

export default function RenderStatsBar() {
    const accessToken = useAuthStore((state) => state.accessToken)
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${DB_API}${ENDPOINTS.readerStats}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (err) {
                console.error('Failed to load reader stats:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [accessToken])

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