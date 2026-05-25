import { getMediaUrl } from '../../../utils/api'
import './authorDashboard.css'

export default function PublishedWorks({ books }) {
    if (!books || books.length === 0) {
        return (
            <section className='dashboard-section published-works'>
                <div className='section-heading-row'>
                    <div>
                        <h2 className='section-heading'>Published</h2>
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
                    <h2 className='section-heading'>Published</h2>
                    <p className='section-subheading'>Live and still in progress</p>
                </div>
                <a href='/author/books' className='view-all-link'>View All</a>
            </div>
            <div className='books-grid'>
                {books.map((book) => (
                    <a key={book.id} href={`/author/books/${book.id}/manage`} className='book-card dashboard-card published-book'>
                        <img
                            src={getMediaUrl(book.cover_image)}
                            alt={book.title}
                            className='book-cover-placeholder'
                        />
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-rating'>⭐ {book.content_rating?.code || 'NR'} · {book.published_chapter_count} chapters</p>
                    </a>
                ))}
            </div>
        </section>
    )
}