const ROLE_OPTIONS = [
    { value: '', label: 'All users' },
    { value: 'reader', label: 'Readers' },
    { value: 'author', label: 'Paid Authors' },
    { value: 'free_author', label: 'Free Authors' },
    { value: 'any_author', label: 'Any Author' },
    { value: 'moderator', label: 'Moderators' },
    { value: 'admin', label: 'Admins' },
]

export default function UserList({ users, selectedUser, onSelect, search, onSearch, roleFilter, onRoleFilter, page, totalPages, onPageChange }) {
    return (
        <div className='admin-list'>
            <div className='admin-filters'>
                <input
                    type='text'
                    className='bff-input'
                    placeholder='Search by email...'
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
                <select
                    className='bff-select'
                    value={roleFilter}
                    onChange={(e) => { onRoleFilter(e.target.value); onPageChange(1) }}
                >
                    {ROLE_OPTIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
            </div>

            {users.length === 0 && (
                <p className='section-note'>No users found.</p>
            )}

            {users.length > 0 && (
                <table className='pending-table'>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Verified</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => onSelect(user)}
                                className={`admin-list-row ${selectedUser?.id === user.id ? 'active' : ''}`}
                            >
                                <td>{user.email}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        {user.profile && <span className='pending-item-badge'>Reader</span>}
                                        {user.author_profile && <span className='pending-item-badge'>Author</span>}
                                        {user.free_author_profile && <span className='pending-item-badge'>Free Author</span>}
                                        {user.moderator_profile && <span className='pending-item-badge'>Moderator</span>}
                                        {user.admin_profile && <span className='pending-item-badge'>Admin</span>}
                                    </div>
                                </td>
                                <td>{user.is_verified ? '✓' : '—'}</td>
                                <td>{new Date(user.profile?.created_at || '').toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className='admin-pagination'>
                    <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>← Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next →</button>
                </div>
            )}
        </div>
    )
}