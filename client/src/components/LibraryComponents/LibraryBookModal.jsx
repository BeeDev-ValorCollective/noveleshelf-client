import { getMediaUrl } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import { UserStar } from 'lucide-react'
import Button from '../ui/Button'

export default function LibraryBookModal({ book, onClose, backTo = '/library' }) {
    const navigate = useNavigate()

    const handleViewDetails = () => {
        onClose()
        navigate(`/library/book/${book.id}`, { state: { backTo } })
    }

    return (
        <div className='library-modal-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className='library-modal'>
                <Button
                    variant='ghost'
                    size='sm'
                    className='library-modal-close'
                    onClick={onClose}
                    aria-label='Close modal'
                >
                    ✕
                </Button>

                <div className='library-modal-content'>
                    <div className='library-modal-cover'>
                        <img src={getMediaUrl(book.cover_image)} alt={book.title} />
                        {book.is_complete && (
                            <span className='book-complete-badge'>✓ Complete</span>
                        )}
                        {book.is_new && (
                            <span className='book-new-badge'>New</span>
                        )}
                    </div>

                    <div className='library-modal-info'>
                        <h2 className='library-modal-title'>{book.title}</h2>
                        <p className='library-modal-author'>
                            by {book.author?.display_name || 'Unknown Author'}
                            
                        </p>
                        <p className='library-modal-author'>{book.is_founding_eligible && (
                                <span className='book-founding-badge'><UserStar color="#ffd900" /> Founding Author Book</span>
                            )}</p>


                        {book.content_rating && (
                            <span className='library-modal-rating'>
                                {book.content_rating.code} — {book.content_rating.name}
                            </span>
                        )}

                        {book.genres?.length > 0 && (
                            <div className='library-modal-tags'>
                                {book.genres.map(g => (
                                    <span key={g.id} className='library-modal-tag'>{g.name}</span>
                                ))}
                            </div>
                        )}

                        {book.relationship_tags?.length > 0 && (
                            <div className='library-modal-tags'>
                                {book.relationship_tags.map(t => (
                                    <span key={t.id} className='library-modal-tag library-modal-tag--rel'>{t.name}</span>
                                ))}
                            </div>
                        )}

                        {book.description && (
                            <p className='library-modal-description'>{book.description}</p>
                        )}

                        <div className='library-modal-meta'>
                            <span>{book.published_chapter_count} chapter{book.published_chapter_count !== 1 ? 's' : ''}</span>{book.book_tier && <span>Tier {book.book_tier}</span>}
                        </div>

                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={handleViewDetails}
                        >
                            View full book details →
                        </Button>

                        <p className='library-modal-coming-soon'>
                            Love what you see? The Novel eShelf app is coming soon — <em>{book.title}</em> will be waiting for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}