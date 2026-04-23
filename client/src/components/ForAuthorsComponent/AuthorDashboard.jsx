import './forAuthors.css'
import DashboardImage from '../../assets/images/dashboard.png'

export default function AuthorDashboard() {
    return (
        <>
            <section className='author-dashboard'>
                <h2>Author Dashboard</h2>
                <div className='dashboard-stats'>
                    <div className='stat-card'>
                        <p className='stat-label'>Total Readers</p>
                        <h3 className='stat-value'>12,847</h3>
                    </div>
                    <div className='stat-card'>
                        <p className='stat-label'>Books Published</p>
                        <h3 className='stat-value'>8</h3>
                    </div>
                    <div className='stat-card'>
                        <p className='stat-label'>Monthly Earnings</p>
                        <h3 className='stat-value'>$4,293</h3>
                    </div>
                    <div className='stat-card'>
                        <p className='stat-label'>Average Rating</p>
                        <h3 className='stat-value'>4.8</h3>
                    </div>
                </div>
                <div className='dashboard-image'>
                    <img src={DashboardImage} alt="Author Dashboard" className='dashboard-img' />
                </div>
            </section>
        </>
    )
}