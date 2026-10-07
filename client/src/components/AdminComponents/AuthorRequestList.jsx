import { REQUEST_STATUS_LABELS, REQUEST_TYPE_LABELS } from '../../utils/constants'
import Button from '../ui/Button'
import Select from '../ui/Select'

const STATUS_OPTIONS = ['pending', 'in_progress', 'not_at_this_time', 'cleared']
const REQUEST_TYPES = ['new_author', 'new_genre', 'tier_review', 'contract_addendum', 'leave_platform', 'rejoin_platform']

export default function AuthorRequestList({ requests, selectedRequest, onSelect, page, totalPages, onPageChange, statusFilter, typeFilter, onStatusFilter, onTypeFilter }) {
    return (
        <div className='admin-list'>
            <div className='admin-filters'>
                <Select
                    value={statusFilter}
                    onChange={(e) => { onStatusFilter(e.target.value); onPageChange(1) }}
                    variant='status'
                    size='md'
                >
                    <option value=''>All statuses</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{REQUEST_STATUS_LABELS[s] || s}</option>
                    ))}
                </Select>
                <Select
                    value={typeFilter}
                    onChange={(e) => { onTypeFilter(e.target.value); onPageChange(1) }}
                    variant='status'
                    size='md'
                >
                    <option value=''>All types</option>
                    {REQUEST_TYPES.map(t => (
                        <option key={t} value={t}>{REQUEST_TYPE_LABELS[t] || t}</option>
                    ))}
                </Select>
            </div>

            {requests.length === 0 && (
                <p className='section-note'>No requests found.</p>
            )}

            {requests.length > 0 && (
                <div className='table-responsive'>
                    <table className='pending-table'>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr
                                    key={req.id}
                                    onClick={() => onSelect(req)}
                                    className={`admin-list-row ${selectedRequest?.id === req.id ? 'active' : ''}`}
                                >
                                    <td>{REQUEST_TYPE_LABELS[req.request_type] || req.request_type}</td>
                                    <td>
                                        <span>{req.user?.email || '—'}</span>
                                    </td>
                                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`project-status ${req.status}`}>
                                            {REQUEST_STATUS_LABELS[req.status] || req.status}
                                        </span>
                                    </td>
                                    <td>{req.contact_attempted ? '✓' : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className='admin-pagination'>
                    <Button
                        variant='secondary'
                        size='md'
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        ← Prev
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button
                        variant='secondary'
                        size='md'
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    )
}