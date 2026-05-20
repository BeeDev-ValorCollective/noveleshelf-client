import { getMediaUrl } from '../../../utils/mediaUrl'
import './authorDashboard.css'

export default function CurrentProjects({ books }) {

    if (!books || books.length === 0) {
        return (
            <section className='dashboard-section current-projects'>
                <h2 className='section-heading'>Current Projects</h2>
                <p className='section-subheading'>Works in progress</p>
                <p style={{ color: '#ffffffa0', textAlign: 'center' }}>No current projects</p>
            </section>
        )
    }

    return (
        <section className='dashboard-section current-projects'>
            <h2 className='section-heading'>Current Projects</h2>
            <p className='section-subheading'>Works in progress</p>
            <div className='projects-list'>
                {books.map((book) => (
                    <div key={book.id} className='project-card dashboard-card'>
                        <img
                            src={getMediaUrl(book.cover_image)}
                            alt={book.title}
                            className='project-cover-placeholder'
                        />
                        <div className='project-info'>
                            <h3 className='project-title'>{book.title}</h3>
                            <span className={`project-status ${book.status}`}>{book.status.replace('_', ' ')}</span>
                        </div>
                        <button className='continue-editing-btn'>Continue Editing</button>
                    </div>
                ))}
            </div>
        </section>
    )
}