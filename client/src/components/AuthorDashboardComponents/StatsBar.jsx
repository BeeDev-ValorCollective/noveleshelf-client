import './authorDashboard.css'

export default function StatsBar() {
    return (
        <section className='dashboard-section stats-bar'>
            <div className='stats-grid'>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Total Readers</p>
                    <h2 className='stat-value'>24.5K</h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Books Published</p>
                    <h2 className='stat-value'>12</h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Monthly Earnings</p>
                    <h2 className='stat-value'>$8.2K</h2>
                </div>
                <div className='stat-item dashboard-card'>
                    <p className='stat-label'>Average Rating</p>
                    <h2 className='stat-value'>4.7</h2>
                </div>
            </div>
        </section>
    )
}