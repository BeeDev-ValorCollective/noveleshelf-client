import { useState } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function BookPageCard({ type, label, page, book, authorType, accessToken, onBookUpdated, navigate, bookId }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handlePublish = async () => {
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.pagePublish}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    page_type: type,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onBookUpdated({ ...book, pages: book.pages.map(p => p.page_type === type ? data.page : p) })
            } else {
                setError(data.error || 'Could not publish page.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUnpublish = async () => {
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.pageUnpublish}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    page_type: type,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onBookUpdated({ ...book, pages: book.pages.map(p => p.page_type === type ? data.page : p) })
            } else {
                setError(data.error || 'Could not unpublish page.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.pageDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    page_type: type,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onBookUpdated({ ...book, pages: book.pages.filter(p => p.page_type !== type) })
            } else {
                setError(data.error || 'Could not delete page.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='book-page-card'>
            <div className='book-page-card-header'>
                <div className='book-page-card-info'>
                    <span className='book-page-card-title'>{label}</span>
                    {page && (
                        <span className={`project-status ${page.is_published ? 'approved' : 'draft'}`}>
                            {page.is_published ? 'Published' : 'Draft'}
                        </span>
                    )}
                </div>
                <div className='book-page-card-actions'>
                    {!page && (
                        <button
                            onClick={() => navigate(
                                `/author/books/${bookId}/pages/${type}`,
                                { state: { book } }
                            )}
                            disabled={isSubmitting}
                        >
                            + Add
                        </button>
                    )}
                    {page && (
                        <>
                            <button
                                onClick={() => navigate(
                                    `/author/books/${bookId}/pages/${type}`,
                                    { state: { book, page } }
                                )}
                                disabled={isSubmitting}
                            >
                                Edit
                            </button>
                            {page.is_published
                                ? <button onClick={handleUnpublish} disabled={isSubmitting}>Unpublish</button>
                                : <button onClick={handlePublish} disabled={isSubmitting}>Publish</button>
                            }
                            <button onClick={handleDelete} disabled={isSubmitting}>Delete</button>
                        </>
                    )}
                </div>
            </div>
            {error && <p className='form-error'>{error}</p>}
        </div>
    )
}