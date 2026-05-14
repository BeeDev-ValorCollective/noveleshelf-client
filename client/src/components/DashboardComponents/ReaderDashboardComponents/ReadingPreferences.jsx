import './readerDashboard.css';

const genres = [
    'Literary Fiction', 'Mystery', 'Historical', 'Contemporary', 'Romance'
]

const goals = [
    { label: 'Books per month', current: 7, target: 10, unit: 'books' },
    { label: 'Daily reading minutes', current: 35, target: 60, unit: 'minutes' },
]

export default function ReadingPreferences() {
    return (
        <section className='reader-section'>
            <h2 className='reader-section-heading'>Reading Preferences</h2>
            <p className='reader-section-subheading'>Your literary tastes and goals</p>
            <div className='preferences-grid'>
                <div className='preferences-column'>
                    <h3 className='preferences-column-title'>Favorite Genres</h3>
                    <div className='genre-tags'>
                        {genres.map((genre, index) => (
                            <span key={index} className='genre-tag'>{genre}</span>
                        ))}
                    </div>
                </div>
                <div className='preferences-column'>
                    <h3 className='preferences-column-title'>Reading Goals</h3>
                    <div className='reading-goals'>
                        {goals.map((goal, index) => (
                            <div key={index} className='goal-item'>
                                <p className='goal-label'>{goal.label}</p>
                                <div className='goal-progress-bar'>
                                    <div className='goal-progress-fill' style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
                                </div>
                                <p className='goal-progress-text'>{goal.current} of {goal.target} {goal.unit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}