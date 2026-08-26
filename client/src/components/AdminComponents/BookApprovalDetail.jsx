import { useState, useEffect } from 'react'
import { getMediaUrl, DB_API, ENDPOINTS } from '../../utils/api'
import { BOOK_STATUS_LABELS } from '../../utils/constants'
import Button from '../ui/Button'
import Select from '../ui/Select'

export default function BookApprovalDetail({ book, accessToken, onUpdated, onActioned, onClose }) {
    const [readerNotes, setReaderNotes] = useState('')
    const [adminNotes, setAdminNotes] = useState('')
    const [bookTier, setBookTier] = useState(book.book_tier || '')
    const [isApproving, setIsApproving] = useState(false)
    const [isRequestingChanges, setIsRequestingChanges] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        setReaderNotes('')
        setAdminNotes('')
        setBookTier(book.book_tier || '')
        setError(null)
        setSuccess(null)
    }, [book.id])

    const isPendingApproval = book.status === 'pending_approval'

    const handleAdminUpdate = async () => {
        setIsUpdating(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBookUpdate}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    ...(bookTier && { book_tier: Number(bookTier) }),
                    ...(adminNotes && { admin_notes: adminNotes }),
                    ...(readerNotes && { reader_notes: readerNotes }),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Book updated successfully.')
                onUpdated(data.book)
            } else {
                setError(data.error || 'Could not update book.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleApprove = async () => {
        if (!readerNotes.trim()) {
            setError('Reader notes are required to approve.')
            return
        }
        setIsApproving(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBookApprove}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    reader_notes: readerNotes,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onActioned(data.book)
            } else {
                setError(data.error || 'Could not approve book.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsApproving(false)
        }
    }

    const handleRequestChanges = async () => {
        if (!readerNotes.trim()) {
            setError('Reader notes are required when requesting changes.')
            return
        }
        setIsRequestingChanges(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBookRequestChanges}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    reader_notes: readerNotes,
                    ...(adminNotes && { admin_notes: adminNotes }),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onActioned(data.book)
            } else {
                setError(data.error || 'Could not request changes.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsRequestingChanges(false)
        }
    }

    const handleReject = async () => {
        if (!readerNotes.trim()) {
            setError('Reader notes are required when rejecting.')
            return
        }
        if (!window.confirm(`Are you sure you want to reject "${book.title}"? This cannot be undone.`)) return
        setIsRejecting(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBookReject}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    reader_notes: readerNotes,
                    ...(adminNotes && { admin_notes: adminNotes }),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onActioned(data.book)
            } else {
                setError(data.error || 'Could not reject book.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsRejecting(false)
        }
    }

    const isWorking = isApproving || isRequestingChanges || isRejecting || isUpdating

    return (
        <div className='request-detail'>
            <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
            >
                ✕ Close
            </Button>

            <h2 className='request-detail-title'>{book.title}</h2>
            <p className='request-detail-date'>
                <span className={`project-status ${book.status}`}>
                    {BOOK_STATUS_LABELS[book.status] || book.status}
                </span>
                {book.submitted_at && (
                    <span> · Submitted {new Date(book.submitted_at).toLocaleDateString()}</span>
                )}
            </p>

            {book.cover_image && (
                <img
                    src={getMediaUrl(book.cover_image)}
                    alt={book.title}
                    className='book-approval-cover'
                />
            )}

            {book.description && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Description</label>
                    <p className='request-detail-text'>{book.description}</p>
                </div>
            )}

            {book.genres?.length > 0 && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Genres</label>
                    <p className='request-detail-text'>{book.genres.map(g => g.name).join(', ')}</p>
                </div>
            )}

            {book.keywords?.length > 0 && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Keywords</label>
                    <p className='request-detail-text'>{book.keywords.map(k => k.name).join(', ')}</p>
                </div>
            )}

            {book.relationship_tags?.length > 0 && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Relationship Tags</label>
                    <p className='request-detail-text'>{book.relationship_tags.map(t => t.name).join(', ')}</p>
                </div>
            )}

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='book-tier'>Book Tier</label>
                <Select
                    variant='form'
                    id='book-tier'
                    className='bff-select'
                    value={bookTier}
                    onChange={(e) => setBookTier(e.target.value)}
                    disabled={isWorking}
                >
                    <option value=''>Select tier</option>
                    {[1, 2, 3, 4, 5].map(t => (
                        <option key={t} value={t}>Tier {t}</option>
                    ))}
                </Select>

            </div>

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='book-admin-notes'>
                    Admin Notes <span className='bff-hint-inline'>(internal)</span>
                </label>
                <textarea
                    id='book-admin-notes'
                    className='bff-textarea'
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    disabled={isWorking}
                    placeholder={book.admin_notes || 'No existing admin notes'}
                />
            </div>

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='book-reader-notes'>
                    Reader Notes <span className='bff-hint-inline'>(visible to author)</span>
                    {isPendingApproval && <span className='bff-required'> *</span>}
                </label>
                <textarea
                    id='book-reader-notes'
                    className='bff-textarea'
                    rows={3}
                    value={readerNotes}
                    onChange={(e) => setReaderNotes(e.target.value)}
                    disabled={isWorking}
                    placeholder={book.reader_notes || 'Message to the author...'}
                />
            </div>

            {success && <p className='form-success'>{success}</p>}
            {error && <p className='form-error'>{error}</p>}

            <Button
                variant='secondary'
                size='sm'
                onClick={handleAdminUpdate}
                disabled={isWorking}
            >
                {isUpdating ? 'Saving...' : 'Save Notes & Tier'}
            </Button>

            {isPendingApproval && (
                <div className='request-approve-section'>
                    <h3>Decision</h3>
                    <p className='section-note'>Reader notes are required for all decisions.</p>
                    <div className='book-approval-actions'>
                        <Button
                            variant='primary'
                            size='md'
                            onClick={handleApprove}
                            disabled={isWorking}
                        >
                            {isApproving ? 'Approving...' : '✓ Approve'}
                        </Button>
                        <Button
                            variant='secondary'
                            size='md'
                            onClick={handleRequestChanges}
                            disabled={isWorking}
                        >
                            {isRequestingChanges ? 'Requesting...' : '↩ Request Changes'}
                        </Button>
                        <Button
                            variant='delete'
                            size='md'
                            onClick={handleReject}
                            disabled={isWorking}
                        >
                            {isRejecting ? 'Rejecting...' : '✕ Reject'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}