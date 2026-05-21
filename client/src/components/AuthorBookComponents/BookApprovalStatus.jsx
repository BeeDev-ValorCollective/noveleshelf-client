import { useState } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function BookApprovalStatus({ book, authorType, accessToken, onBookUpdated }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.bookSubmit}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onBookUpdated(data.book)
            } else {
                setError(data.error || 'Could not submit book.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (book.status === 'approved') {
        return <p className='form-success'>This book has been approved and is live.</p>
    }

    if (book.status === 'pending_approval') {
        return <p className='section-note'>Your book is currently under review. We'll notify you once a decision has been made.</p>
    }

    if (book.status === 'rejected') {
        return <p className='form-error'>This book has been rejected. Please contact admin for more information.</p>
    }

    if (book.status === 'draft') {
        return (
            <div>
                <p className='section-note'>Once you're happy with your book details, submit it for admin review.</p>
                {error && <p className='form-error'>{error}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
            </div>
        )
    }

    if (book.status === 'changes_requested') {
        return (
            <div>
                <p className='section-note'>Admin has requested changes to your book. Make the necessary updates and resubmit when ready.</p>
                {error && <p className='form-error'>{error}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Resubmit for Approval'}
                </button>
            </div>
        )
    }

    return null
}