import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { STATUS_LABELS } from '../../utils/books'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../utils/api'


export default function BookDetail() {
    const { bookId } = useParams()
    const { state } = useLocation()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const [book, setBook] = useState(state?.book || null)
    const [isLoading, setIsLoading] = useState(!state?.book)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (state?.book) return

        const fetchBook = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const url = `${DB_API}${ENDPOINTS.bookDetail(bookId)}${authorType ? `?author_type=${authorType}` : ''}`
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                const data = await res.json()
                if (res.ok) {
                    setBook(data.book)
                } else {
                    setError(data.error || 'Could not load book.')
                }
            } catch (err) {
                setError('Unable to connect. Please check your connection and try again.')
            } finally {
                setIsLoading(false)
            }
        }

        if (accessToken) fetchBook()
    }, [bookId, accessToken])

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>{error}</p>
    if (!book) return null

    return (
        <div className='book-detail'>
            <div className='book-detail-header'>
                <a href='/author/my-books' className='back-link'>← Back to My Books</a>
                <div className='book-detail-title-row'>
                    <h1>{book.title}</h1>
                    <a href={`/author/books/${book.id}/manage`} className='cb-btn cb-btn--primary'>
                        Manage Book
                    </a>
                </div>
                <span className={`project-status ${book.status}`}>
                    {STATUS_LABELS[book.status] ?? book.status.replace(/_/g, ' ')}
                </span>
            </div>

            {book.description && (
                <section className='book-detail-section'>
                    <h2>Description</h2>
                    <p>{book.description}</p>
                </section>
            )}

            <section className='book-detail-section'>
                <h2>Details</h2>
                <div className='book-detail-meta'>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Content Rating</span>
                        <span className='meta-value'>
                            {book.content_rating
                                ? `${book.content_rating.code} — ${book.content_rating.name}`
                                : 'Not set'}
                        </span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Free Chapters</span>
                        <span className='meta-value'>{book.free_chapters}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Total Chapters</span>
                        <span className='meta-value'>{book.chapter_count}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Published Chapters</span>
                        <span className='meta-value'>{book.published_chapter_count}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Complete</span>
                        <span className='meta-value'>{book.is_complete ? 'Yes' : 'No'}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Visible</span>
                        <span className='meta-value'>{book.is_visible ? 'Yes' : 'No'}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Created</span>
                        <span className='meta-value'>{new Date(book.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className='book-detail-meta-row'>
                        <span className='meta-label'>Last Updated</span>
                        <span className='meta-value'>{new Date(book.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </section>

            {book.genres?.length > 0 && (
                <section className='book-detail-section'>
                    <h2>Genres</h2>
                    <div className='book-detail-tags'>
                        {book.genres.map((g) => (
                            <span key={g.id} className='book-tag'>{g.name}</span>
                        ))}
                    </div>
                </section>
            )}

            {book.keywords?.length > 0 && (
                <section className='book-detail-section'>
                    <h2>Keywords</h2>
                    <div className='book-detail-tags'>
                        {book.keywords.map((k) => (
                            <span key={k.id} className='book-tag'>{k.name}</span>
                        ))}
                    </div>
                </section>
            )}

            {book.relationship_tags?.length > 0 && (
                <section className='book-detail-section'>
                    <h2>Relationship Tags</h2>
                    <div className='book-detail-tags'>
                        {book.relationship_tags.map((t) => (
                            <span key={t.id} className='book-tag'>{t.code} — {t.name}</span>
                        ))}
                    </div>
                </section>
            )}

            {book.chapters?.length > 0 && (
                <section className='book-detail-section'>
                    <h2>Chapters</h2>
                    <div className='book-detail-chapters'>
                        {book.chapters.map((ch) => (
                            <div key={ch.id} className='book-detail-chapter-row'>
                                <span className='chapter-title'>{ch.display_title}</span>
                                <span className={`project-status ${ch.status}`}>{ch.status}</span>
                                <span className='chapter-meta'>{ch.word_count.toLocaleString()} words</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}