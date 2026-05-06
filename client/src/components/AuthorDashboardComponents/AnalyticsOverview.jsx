import './authorDashboard.css'

export default function AnalyticsOverview() {
    return (
        <section className='dashboard-section analytics-overview'>
            <div className='analytics-header'>
                <h2 className='section-heading'>Analytics Overview</h2>
                <div className='time-toggle'>
                    <button className='time-btn active'>7d</button>
                    <button className='time-btn'>30d</button>
                    <button className='time-btn'>90d</button>
                    <button className='time-btn'>1y</button>
                </div>
            </div>
            <div className='analytics-large-stats'>
                <div className='large-stat-card dashboard-card'>
                    <p className='stat-label'>Monthly Reads</p>
                    <h2 className='large-stat-value'>142K</h2>
                </div>
                <div className='large-stat-card dashboard-card'>
                    <p className='stat-label'>Revenue Growth</p>
                    <h2 className='large-stat-value'>+24%</h2>
                </div>
                <div className='large-stat-card dashboard-card'>
                    <p className='stat-label'>Engagement Rate</p>
                    <h2 className='large-stat-value'>89%</h2>
                </div>
            </div>
            <div className='analytics-small-stats'>
                <div className='small-stat-card dashboard-card'>
                    <p className='stat-label'>Day Reads</p>
                    <h3 className='small-stat-value'>4,118</h3>
                </div>
                <div className='small-stat-card dashboard-card'>
                    <p className='stat-label'>Completion Rate</p>
                    <h2 className='small-stat-value'>76%</h2>
                </div>
                <div className='small-stat-card dashboard-card'>
                    <p className='stat-label'>Returning Readers</p>
                    <h2 className='small-stat-value'>74%</h2>
                </div>
                <div className='small-stat-card dashboard-card'>
                    <p className='stat-label'>Q & B</p>
                    <h2 className='small-stat-value'>8.4K</h2>
                </div>
            </div>
            <div className='analytics-bottom'>
                <div className='reading-activity dashboard-card'>
                    <h3>Reading Activity</h3>
                    <p className='chart-subtitle'>Daily reads over the last 30 days</p>
                    <div className='bar-chart-placeholder'>
                        <div className='bar' style={{height: '60%'}}></div>
                        <div className='bar' style={{height: '80%'}}></div>
                        <div className='bar' style={{height: '50%'}}></div>
                        <div className='bar' style={{height: '77%'}}></div>
                        <div className='bar' style={{height: '70%'}}></div>
                        <div className='bar' style={{height: '80%'}}></div>
                        <div className='bar' style={{height: '76%'}}></div>
                    </div>
                </div>
                <div className='performance-insights dashboard-card'>
                    <h3>Performance Insights</h3>
                    <p className='chart-subtitle'>Key Metrics Breakdown</p>
                    <div className='insight-item'>
                        <p className='insight-label'>Top performing Book</p>
                        <p className='insight-value'>The Silent Witness</p>
                    </div>
                    <div className='insight-item'>
                        <p className='insight-label'>Most Read Chapter</p>
                        <p className='insight-value'>Chapter 7: The Reveal</p>
                    </div>
                    <div className='insight-item'>
                        <p className='insight-label'>Peak Reading Time</p>
                        <p className='insight-value'>8:00 PM - 11:00 PM</p>
                    </div>
                    <div className='insight-item'>
                        <p className='insight-label'>Top Reader Region</p>
                        <p className='insight-value'>North America</p>
                    </div>
                </div>
            </div>
        </section>
    )
}