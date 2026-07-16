import { getMediaUrl } from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function LibraryAuthorModal({ author, onClose, backTo = '/library' }) {
    const navigate = useNavigate()

    const handleViewAuthorDetails = () => {
        onClose()
        navigate(`/library/author/${author.username}`, { state: { backTo } })
    }

    
    return (
        <div className='library-modal-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className='library-modal'>
                <button className='library-modal-close' onClick={onClose}>✕</button>

                <div className='library-modal-content'>
                    <div className='library-modal-cover'>
                        {author.avatar_url
                            ? <img src={getMediaUrl(author.avatar_url)} alt={author.display_name} />
                            : <div className='author-card-avatar-placeholder'>{author.display_name?.[0] ?? '?'}</div>
                        }
                    </div>

                    <div className='library-modal-info'>
                        <h2 className='library-modal-title'>{author.display_name}</h2>

                        {author.username && (
                            <p className='library-modal-author'>@{author.username}</p>
                        )}

                        <div className='library-modal-tags'>
                            {author.is_founding_author && (
                                <span className='author-founding-badge'>Founding Author</span>
                            )}
                            {author.is_featured && (
                                <span className='library-modal-tag'>Featured</span>
                            )}
                        </div>

                        {author.bio && (
                            <p className='library-modal-description'>{author.bio}</p>
                        )}

                        <div className='library-modal-meta'>
                            <span>{author.book_count} {author.book_count === 1 ? 'book' : 'books'}</span>
                        </div>

                        <button className='library-modal-details-btn' onClick={handleViewAuthorDetails}>
                            View full author details →
                        </button>

                        {/* Added the disabled class here and in the library.css with display: none set to remove this button until it is functional */}
                        <button className='library-modal-details-btn disabled'>
                            Follow
                        </button>

                        <p className='library-modal-coming-soon'>
                            Author pages and following are coming soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}