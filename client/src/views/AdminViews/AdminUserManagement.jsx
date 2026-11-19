import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import UserList from '../../components/AdminComponents/UserList'
import UserDetail from '../../components/AdminComponents/UserDetail'
import Button from '../../components/ui/Button'
import { ADMIN_DEFAULT_PAGE_SIZE } from '../../utils/adminList'
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
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [order, setOrder] = useState('newest')
    const [pageSize, setPageSize] = useState(ADMIN_DEFAULT_PAGE_SIZE)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedUser, setSelectedUser] = useState(null)

    // Search runs on the server; wait for typing to pause before fetching.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim())
            setPage(1)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const fetchUsers = async (signal) => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ page, page_size: pageSize, order })
            if (roleFilter) params.append('role', roleFilter)
            if (debouncedSearch) params.append('search', debouncedSearch)
            const res = await fetch(`${DB_API}${ENDPOINTS.adminListUsers}?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                signal,
            })
            const data = await res.json()
            if (res.ok) {
                setUsers(data.results)
                setTotalPages(data.total_pages)
            } else {
                setError(data.error || 'Could not load users.')
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            setError('Unable to connect. Please try again.')
        } finally {
            if (!signal.aborted) setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!accessToken) return
        // Abort the previous request so a slow, older response can't overwrite a newer one.
        const controller = new AbortController()
        fetchUsers(controller.signal)
        return () => controller.abort()
    }, [accessToken, roleFilter, order, pageSize, debouncedSearch, page])

    const handleUserUpdated = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
        setSelectedUser(updatedUser)
    }

    return (
        <div className='admin-page'>
            <div className='admin-page-header'>
                <Button
                    variant='primary'
                    size='sm'
                    onClick={() => navigate('/dashboard')}
                >
                    ← Back to dashboard
                </Button>
                <h1>User Management</h1>
            </div>

            {error && <p className='form-error'>{error}</p>}

            {/* Stays mounted while loading so the search box keeps focus */}
            <div className='admin-layout'>
                <UserList
                    users={users}
                    isLoading={isLoading}
                    selectedUser={selectedUser}
                    onSelect={setSelectedUser}
                    search={search}
                    onSearch={setSearch}
                    roleFilter={roleFilter}
                    onRoleFilter={setRoleFilter}
                    order={order}
                    onOrder={setOrder}
                    pageSize={pageSize}
                    onPageSize={setPageSize}
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
        </div>
    )
}