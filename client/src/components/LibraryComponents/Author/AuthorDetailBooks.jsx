import { getMediaUrl } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function AuthorDetailBooks({ books, authorName }) {
    const navigate = useNavigate()

    if (!books || books.length === 0) {
        return (
            <div className="ad-no-books">
                <p>No published stories yet by this author.</p>
            </div>
        )
    }

    return (
        <div className="ad-books-section">
            <h2 className="ad-section-title">Stories by {authorName}</h2>
            <div className="ad-book-list">
                {books.map((book) => (
                    <div 
                        key={book.id} 
                        className="ad-book-row-card"
                        onClick={() => navigate(`/library/book/${book.id}`, { state: { backTo: window.location.pathname } })}
                    >
                        {/* Book Cover Container */}
                        <div className="ad-book-cover-frame">
                            <img src={getMediaUrl(book.cover_image)} alt={book.title} />
                        </div>

                        {/* Extended Info Block */}
                        <div className="ad-book-details">
                            <div className="ad-book-header-row">
                                <h3 className="ad-book-row-title">{book.title}</h3>
                                
                                <div className="ad-book-badges">
                                    {book.is_new && <span className="ad-badge-new">New</span>}
                                    {book.is_complete && <span className="ad-badge-complete">✓ Complete</span>}
                                    {book.content_rating?.code && (
                                        <span className="ad-badge-rating">{book.content_rating.code}</span>
                                    )}
                                </div>
                            </div>

                            {/* Stats Line */}
                            <div className="ad-book-stats">
                                <span>📖 Chapters: <strong>{book.published_chapter_count ?? 0}</strong></span>
                            </div>

                            {/* Description Text block */}
                            {book.description && (
                                <p className="ad-book-row-desc">{book.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}