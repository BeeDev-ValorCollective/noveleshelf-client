import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import UserList from '../../components/AdminComponents/UserList'
import UserDetail from '../../components/AdminComponents/UserDetail'
import '../../components/AdminComponents/adminComponents.css'

export default function AdminUserManagement() {
    const navigate = useNavigate()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentUser = useAuthStore((state) => state.user)

    const isSuperAdmin = currentUser?.admin_profile?.is_super_admin

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)

    const fetchUsers = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ page })
            if (roleFilter) params.append('role', roleFilter)
            const res = await fetch(`${DB_API}${ENDPOINTS.adminListUsers}?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setUsers(data.results)
                setTotalPages(data.total_pages)
            } else {
                setError(data.error || 'Could not load users.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (accessToken) fetchUsers()
    }, [accessToken, roleFilter, page])

    const handleUserUpdated = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
        setSelectedUser(updatedUser)
    }

    const filteredUsers = search
        ? users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))
        : users

    return (
        <div className='admin-page'>
            <div className='admin-page-header'>
                <button onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
                <h1>User Management</h1>
            </div>

            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}

            {!isLoading && !error && (
                <div className='admin-layout'>
                    <UserList
                        users={filteredUsers}
                        selectedUser={selectedUser}
                        onSelect={setSelectedUser}
                        search={search}
                        onSearch={setSearch}
                        roleFilter={roleFilter}
                        onRoleFilter={setRoleFilter}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                    <div className='admin-detail'>
                        {!selectedUser && (
                            <p className='section-note'>Select a user to manage.</p>
                        )}
                        {selectedUser && (
                            <UserDetail
                                user={selectedUser}
                                accessToken={accessToken}
                                isSuperAdmin={isSuperAdmin}
                                onUpdated={handleUserUpdated}
                                onClose={() => setSelectedUser(null)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}