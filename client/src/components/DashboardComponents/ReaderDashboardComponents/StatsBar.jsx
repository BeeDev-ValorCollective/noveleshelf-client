import '../ReaderDashboardComponents/readerDashboard.css';

export default function RenderStatsBar() {
    return (
        <section className='reader-section'>
            <div className='reader-stats-grid'>
                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Books Read</p>
                    <h2 className='reader-stat-value'>127</h2>
                </div>
                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Currently Reading</p>
                    <h2 className='reader-stat-value'>3</h2>
                </div>
                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Reading Streak</p>
                    <h2 className='reader-stat-value'>42</h2>
                </div>
                <div className='reader-stat-item'>
                    <p className='reader-stat-label'>Average Rating</p>
                    <h2 className='reader-stat-value'>4.3</h2>
                </div>
            </div>
        </section>
    );
}