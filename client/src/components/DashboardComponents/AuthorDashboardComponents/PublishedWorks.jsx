import { getMediaUrl } from '../../../utils/api'
import './authorDashboard.css'

export default function PublishedWorks({ books }) {
    if (!books || books.length === 0) {
        return (
            <section className='dashboard-section published-works'>
                <div className='section-heading-row'>
                    <div>
                        <h2 className='section-heading'>On the Shelf</h2>
                        <p className='section-subheading'>Live and still in progress</p>
                    </div>
                    <a href='/author/books' className='view-all-link'>View All</a>
                </div>
                <p style={{ color: '#ffffffa0', textAlign: 'center' }}>No published works yet</p>
            </section>
        )
    }

    return (
        <section className='dashboard-section published-works'>
            <div className='section-heading-row'>
                <div>
                    <h2 className='section-heading'>On the Shelf</h2>
                    <p className='section-subheading'>Live and still in progress</p>
                </div>
                <a href='/author/books' className='view-all-link'>View All</a>
            </div>
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
                            <span className={`project-status ${book.status}`}>
                                {book.status.replace(/_/g, ' ')}
                            </span>
                            <span className='book-rating'>
                                ⭐ {book.content_rating?.code || 'NR'} · {book.published_chapter_count} chapters
                            </span>
                        </div>
                        <button className='continue-editing-btn'>
                            <a href={`/author/books/${book.id}/manage`}>Manage Book</a>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}