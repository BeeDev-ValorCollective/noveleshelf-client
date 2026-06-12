import { REQUEST_STATUS_LABELS } from '../../../utils/constants'

export default function PendingAuthorRequests({ requests, isLoading, error }) {
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
                                <td>{req.user?.email || `#${req.user?.id}`}</td>
                                <td>{req.genre_interest || '—'}</td>
                                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                                <td>
                                    <span className={`project-status ${req.status}`}>
                                        {REQUEST_STATUS_LABELS[req.status] || req.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}