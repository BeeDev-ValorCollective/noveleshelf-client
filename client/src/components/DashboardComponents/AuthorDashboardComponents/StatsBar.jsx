import './authorDashboard.css'
import useFollowerCount from '../../../hooks/useFollowerCount'

export default function StatsBar({ booksPublished, booksInProgress, profileType }) {
    const { followerCount, loading: followersLoading } = useFollowerCount(profileType)


    console.log('info', booksInProgress, booksPublished)

    return (
        <section className='dashboard-section stats-bar'>
            <div className='stats-grid'>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>
                        {followerCount === 1 ? 'Follower' : 'Followers'}
                    </p>
                    <h2 className='stat-value'>
                        {followersLoading ? '-' : followerCount}
                    </h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Books On Shelf</p>
                    <h2 className='stat-value'>{booksPublished}</h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Draft Books</p>
                    <h2 className='stat-value'>{booksInProgress}</h2>
                </div>
                {/* <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Monthly Earnings</p>
                    <h2 className='stat-value'>-</h2>
                </div> */}
                {/* <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Average Rating</p>
                    <h2 className='stat-value'>-</h2>
                </div> */}
            </div>
        </section>
    )
}