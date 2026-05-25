import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'

import './adminDash.css'

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
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorRequests}?status=pending`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) setRequests((data.results || []).slice(0, 5))
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
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBooks}?status=pending_approval`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) setBooks((data.results || []).slice(0, 5))
            else setBooksError(data.error || 'Could not load books.')
        } catch {
            setBooksError('Unable to connect.')
        } finally {
            setBooksLoading(false)
        }
    }

    return (
        <section className='dashboard-section pending-reviews-panel'>
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
        </section>
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
            {!isLoading && !error && requests.length > 0 && (
                <table className='pending-table'>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>User</th>
                            <th>Genre Interest</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td>{req.request_type.replace(/_/g, ' ')}</td>
                                <td>#{req.user}</td>
                                <td>{req.genre_interest || '—'}</td>
                                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                <td><span className={`project-status ${req.status}`}>{req.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
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
            {!isLoading && !error && books.length > 0 && (
                <table className='pending-table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Rating</th>
                            <th>Chapters</th>
                            <th>Submitted</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    {book.title}
                                    {book.has_pending_changes && (
                                        <span className='pending-item-badge'>Has changes</span>
                                    )}
                                </td>
                                <td>{book.content_rating?.code || 'NR'}</td>
                                <td>{book.chapter_count}</td>
                                <td>{book.submitted_at ? new Date(book.submitted_at).toLocaleDateString() : '—'}</td>
                                <td><a href={`/admin/book-approvals/${book.id}`} className='pending-item-action'>Review</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}