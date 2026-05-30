import { getMediaUrl } from '../../../utils/api'
import './freeAuthorDashboard.css'

export default function FinishedBooks({ books }) {
    if (!books || books.length === 0) return null

    return (
        <section className='dashboard-section finished-books'>
            <div className='section-heading-row'>
                <div>
                    <h2 className='section-heading'>Finished Books</h2>
                    <p className='section-subheading'>Completed works</p>
                </div>
                <a href='/author/books' className='view-all-link'>View All</a>
            </div>
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