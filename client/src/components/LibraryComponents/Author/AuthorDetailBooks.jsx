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
            <ul className="book-grid">
                {books.map((book) => (
                    <li 
                        key={book.id} 
                        onClick={() => navigate(`/library/book/${book.id}`, { state: { backTo: window.location.pathname } })}
                    >
                        <img src={getMediaUrl(book.cover_image)} alt={book.title} />
                        <span className="bookTitle">{book.title}</span>
                        {book.is_complete && (
                            <span className="book-complete-badge">✓ Complete</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}