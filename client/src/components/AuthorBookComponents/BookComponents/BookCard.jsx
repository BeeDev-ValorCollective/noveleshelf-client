import { STATUS_LABELS } from '../../../utils/books'

export default function BookCard({ book, onClick, actions }) {
    const handleKeyDown = (e) => {
        if (onClick && e.key === 'Enter') onClick(book)
    }

    return (
        <div
            className='book-card'
            onClick={onClick ? () => onClick(book) : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={handleKeyDown}
        >
            <div className='book-card-info'>
                <h2 className='book-card-title'>{book.title}</h2>
                <span className={`project-status ${book.status}`}>
                    {STATUS_LABELS[book.status] ?? book.status.replace(/_/g, ' ')}
                </span>
            </div>

            <div className='book-card-meta'>
                <span>{book.chapter_count} chapter{book.chapter_count !== 1 ? 's' : ''}</span>
                <span>Updated {new Date(book.updated_at).toLocaleDateString()}</span>
            </div>

            {actions && (
                <div className='book-card-actions'>
                    {actions(book)}
                </div>
            )}
        </div>
    )
}