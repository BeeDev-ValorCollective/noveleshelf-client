import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'
import { REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS } from '../../utils/constants'

const STATUS_OPTIONS = ['pending', 'in_progress', 'not_at_this_time', 'cleared']

export default function AuthorRequestDetail({ request, accessToken, onUpdated, onApproved, onClose }) {
    const [formData, setFormData] = useState({
        status: request.status,
        admin_notes: request.admin_notes || '',
        reader_notes: request.reader_notes || '',
        contact_attempted: request.contact_attempted || false,
    })
    const [approveData, setApproveData] = useState({
        first_name: '',
        last_name: '',
    })
    const [isUpdating, setIsUpdating] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        setFormData({
            status: request.status,
            admin_notes: request.admin_notes || '',
            reader_notes: request.reader_notes || '',
            contact_attempted: request.contact_attempted || false,
        })
        setApproveData({ first_name: '', last_name: '' })
        setError(null)
        setSuccess(null)
    }, [request.id])

    const handleUpdate = async () => {
        setIsUpdating(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorReqUpdate}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: request.id,
                    status: formData.status,
                    admin_notes: formData.admin_notes || undefined,
                    reader_notes: formData.reader_notes || undefined,
                    contact_attempted: formData.contact_attempted,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Request updated successfully.')
                onUpdated(data.request)
            } else {
                setError(data.error || 'Could not update request.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleApprove = async () => {
        if (request.request_type === 'new_author' && (!approveData.first_name || !approveData.last_name)) {
            setError('First name and last name are required to approve a new author request.')
            return
        }
        setIsApproving(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorReqApprove}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: request.id,
                    ...(request.request_type === 'new_author' && {
                        first_name: approveData.first_name,
                        last_name: approveData.last_name,
                    }),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Request approved successfully.')
                onApproved(data.request)
            } else {
                setError(data.error || 'Could not approve request.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsApproving(false)
        }
    }

    const isApproved = request.status === 'approved'

    return (
        <div className='request-detail'>
            <button className='admin-detail-close' onClick={onClose}>✕ Close</button>

            <h2 className='request-detail-title'>
                {REQUEST_TYPE_LABELS[request.request_type] || request.request_type} — {request.user?.email || `User #${request.user?.id}`}
            </h2>
            <p className='request-detail-date'>
                Submitted {new Date(request.created_at).toLocaleDateString()}
            </p>

            {request.bio && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Bio</label>
                    <p className='request-detail-text'>{request.bio}</p>
                </div>
            )}

            {request.genre_interest && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Genre Interest</label>
                    <p className='request-detail-text'>{request.genre_interest}</p>
                </div>
            )}

            {request.writing_sample_link && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Writing Sample</label>
                    <a href={request.writing_sample_link} target='_blank' rel='noopener noreferrer' className='request-detail-link'>
                        View writing sample →
                    </a>
                </div>
            )}

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='req-status'>Status</label>
                <select
                    id='req-status'
                    className='bff-select'
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    disabled={isApproved}
                >
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{REQUEST_STATUS_LABELS[s] || s}</option>
                    ))}
                </select>
            </div>

            <div className='request-detail-section'>
                <label className='bff-label bff-label--toggle' htmlFor='req-contact'>
                    <input
                        id='req-contact'
                        type='checkbox'
                        checked={formData.contact_attempted}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_attempted: e.target.checked }))}
                        disabled={isApproved}
                    />
                    Contact attempted
                </label>
            </div>

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='req-admin-notes'>
                    Admin Notes <span className='bff-hint-inline'>(internal)</span>
                </label>
                <textarea
                    id='req-admin-notes'
                    className='bff-textarea'
                    rows={3}
                    value={formData.admin_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    disabled={isApproved}
                />
            </div>

            <div className='request-detail-section'>
                <label className='bff-label' htmlFor='req-reader-notes'>
                    Reader Notes <span className='bff-hint-inline'>(visible to user)</span>
                </label>
                <textarea
                    id='req-reader-notes'
                    className='bff-textarea'
                    rows={3}
                    value={formData.reader_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, reader_notes: e.target.value }))}
                    disabled={isApproved}
                />
            </div>

            {!isApproved && (
                <button onClick={handleUpdate} disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
            )}

            {!isApproved && (
                <div className='request-approve-section'>
                    <h3>Approve Request</h3>
                    {request.request_type === 'new_author' && (
                        <>
                            <div className='bff-field'>
                                <label className='bff-label' htmlFor='req-first-name'>
                                    First Name <span className='bff-required'>*</span>
                                </label>
                                <input
                                    id='req-first-name'
                                    type='text'
                                    className='bff-input'
                                    value={approveData.first_name}
                                    onChange={(e) => setApproveData(prev => ({ ...prev, first_name: e.target.value }))}
                                />
                            </div>
                            <div className='bff-field'>
                                <label className='bff-label' htmlFor='req-last-name'>
                                    Last Name <span className='bff-required'>*</span>
                                </label>
                                <input
                                    id='req-last-name'
                                    type='text'
                                    className='bff-input'
                                    value={approveData.last_name}
                                    onChange={(e) => setApproveData(prev => ({ ...prev, last_name: e.target.value }))}
                                />
                            </div>
                        </>
                    )}
                    <button onClick={handleApprove} disabled={isApproving}>
                        {isApproving ? 'Approving...' : 'Approve Request'}
                    </button>
                </div>
            )}

            {isApproved && (
                <p className='form-success'>This request has been approved.</p>
            )}

            {error && <p className='form-error'>{error}</p>}
            {success && <p className='form-success'>{success}</p>}
        </div>
    )
}