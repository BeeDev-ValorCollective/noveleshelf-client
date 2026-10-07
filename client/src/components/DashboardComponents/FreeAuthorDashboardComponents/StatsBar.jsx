import "./freeAuthorDashboard.css";
import useFollowerCount from '../../../hooks/useFollowerCount'

export default function StatsBar({ booksPublished, booksInProgress, profileType }) {
    const { followerCount, loading: followersLoading } = useFollowerCount(profileType)


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
                    <p className='stat-label'>Books Published</p>
                    <h2 className='stat-value'>{booksPublished}</h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Books in Progress</p>
                    <h2 className='stat-value'>{booksInProgress}</h2>
                </div>
                {/* <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Average Rating</p>
                    <h2 className='stat-value'>-</h2>
                </div> */}
                {/* <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Total Chapters Written</p>
                    <h2 className='stat-value'>-</h2>
                </div> */}
            </div>
        </section>
    )
}