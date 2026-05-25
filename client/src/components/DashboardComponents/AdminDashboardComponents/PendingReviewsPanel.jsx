import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import PendingAuthorRequests from './PendingAuthorRequests'
import PendingBookApprovals from './PendingBookApprovals'
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
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorRequests}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                const active = (data.results || []).filter(r =>
                    ['pending', 'in_progress'].includes(r.status)
                )
                setRequests(active.slice(0, 5))
            } else {
                setRequestsError(data.error || 'Could not load requests.')
            }
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