import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'

export default function PendingReviewsPanel({ accessToken }) {
    const [requests, setRequests] = useState([])
    const [books, setBooks] = useState([])
    const [requestsLoading, setRequestsLoading] = useState(true)
    const [booksLoading, setBooksLoading] = useState(true)
    const [requestsError, setRequestsError] = useState(null)
    const [booksError, setBooksError] = useState(null)

    useEffect(() => {
        if (!accessToken) return
        fetchPendingRequests()
        fetchPendingBooks()
    }, [accessToken])

    const fetchPendingRequests = async () => {
        setRequestsLoading(true)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorRequests}?status=pending&page_size=5`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) setRequests(data.results || [])
            else setRequestsError(data.error || 'Could not load requests.')
        } catch {
            setRequestsError('Unable to connect.')
        } finally {
            setRequestsLoading(false)
        }
    }

    const fetchPendingBooks = async () => {
        setBooksLoading(true)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBooks}?status=pending_approval&page_size=5`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) setBooks(data.books || [])
            else setBooksError(data.error || 'Could not load books.')
        } catch {
            setBooksError('Unable to connect.')
        } finally {
            setBooksLoading(false)
        }
    }

    return (
        <div className='pending-reviews-panel'>
            <PendingAuthorRequests
                requests={requests}
                isLoading={requestsLoading}
                error={requestsError}
            />
            <PendingBookApprovals
                books={books}
                isLoading={booksLoading}
                error={booksError}
            />
        </div>
    )
}

function PendingAuthorRequests({ requests, isLoading, error }) {
    return (
        <div className='pending-panel'>
            <div className='pending-panel-header'>
                <h2 className='pending-panel-title'>Author Requests</h2>
                <a href='/admin/author-requests' className='view-all-link'>View All</a>
            </div>
            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}
            {!isLoading && !error && requests.length === 0 && (
                <p className='section-note'>No pending author requests.</p>
            )}
            {!isLoading && !error && requests.map((req) => (
                <div key={req.id} className='pending-item'>
                    <div className='pending-item-info'>
                        <span className='pending-item-title'>
                            {req.request_type.replace(/_/g, ' ')}
                        </span>
                        <span className='pending-item-meta'>
                            User #{req.user} · {new Date(req.created_at).toLocaleDateString()}
                        </span>
                        {req.genre_interest && (
                            <span className='pending-item-meta'>{req.genre_interest}</span>
                        )}
                    </div>
                    <span className={`project-status ${req.status}`}>{req.status}</span>
                </div>
            ))}
        </div>
    )
}

function PendingBookApprovals({ books, isLoading, error }) {
    return (
        <div className='pending-panel'>
            <div className='pending-panel-header'>
                <h2 className='pending-panel-title'>Book Approvals</h2>
                <a href='/admin/book-approvals' className='view-all-link'>View All</a>
            </div>
            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}
            {!isLoading && !error && books.length === 0 && (
                <p className='section-note'>No books pending approval.</p>
            )}
            {!isLoading && !error && books.map((book) => (
                <div key={book.id} className='pending-item'>
                    <div className='pending-item-info'>
                        <span className='pending-item-title'>{book.title}</span>
                        <span className='pending-item-meta'>
                            {book.author?.pen_name || book.author?.author_username || 'Unknown'} · {new Date(book.submitted_at).toLocaleDateString()}
                        </span>
                        {book.has_pending_changes && (
                            <span className='pending-item-badge'>Has changes</span>
                        )}
                    </div>
                    <a href={`/admin/book-approvals/${book.id}`} className='pending-item-action'>
                        Review
                    </a>
                </div>
            ))}
        </div>
    )
}