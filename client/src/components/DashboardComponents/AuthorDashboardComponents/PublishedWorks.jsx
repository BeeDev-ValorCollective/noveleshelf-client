import { getMediaUrl } from "../../../utils/mediaUrl"
import './authorDashboard.css'

export default function PublishedWorks({ books }) {

    if (!books || books.length === 0) {
        return (
            <section className='dashboard-section published-works'>
                <h2 className='section-heading'>Published Works</h2>
                <p className='section-subheading'>Your literary collection</p>
                <p style={{ color: '#ffffffa0', textAlign: 'center' }}>No published works yet</p>
            </section>
        )
    }

    return (
        <section className='dashboard-section published-works'>
            <h2 className='section-heading'>Published Works</h2>
            <p className='section-subheading'>Your literary collection</p>
            <div className='books-grid'>
                {books.map((book) => (
                    <div key={book.id} className='book-card dashboard-card'>
                        <img
                            src={getMediaUrl(book.cover_image)}
                            alt={book.title}
                            className='book-cover-placeholder'
                        />
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-rating'>⭐ {book.content_rating?.code || 'NR'} · {book.published_chapter_count} chapters</p>
                    </div>
                ))}
            </div>
        </section>
    )
}