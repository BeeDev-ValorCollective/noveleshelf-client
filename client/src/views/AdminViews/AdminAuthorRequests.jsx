import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import AuthorRequestList from '../../components/AdminComponents/AuthorRequestList'
import AuthorRequestDetail from '../../components/AdminComponents/AuthorRequestDetail'
import '../../components/AdminComponents/adminComponents.css'

export default function AdminAuthorRequests() {
    const navigate = useNavigate()
    const accessToken = useAuthStore((state) => state.accessToken)

    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('pending')
    const [typeFilter, setTypeFilter] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedRequest, setSelectedRequest] = useState(null)

    const fetchRequests = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ page })
            if (statusFilter) params.append('status', statusFilter)
            if (typeFilter) params.append('request_type', typeFilter)
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorRequests}?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setRequests(data.results)
                setTotalPages(data.total_pages)
            } else {
                setError(data.error || 'Could not load requests.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (accessToken) fetchRequests()
    }, [accessToken, statusFilter, typeFilter, page])

    const handleRequestUpdated = (updatedRequest) => {
        setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r))
        setSelectedRequest(updatedRequest)
    }

    const handleRequestApproved = (updatedRequest) => {
        setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r))
        setSelectedRequest(null)
    }

    return (
        <div className='admin-page'>
            <div className='admin-page-header'>
                <button onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
                <h1>Author Requests</h1>
            </div>

            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}

            {!isLoading && !error && (
                <div className='admin-layout'>
                    <AuthorRequestList
                        requests={requests}
                        selectedRequest={selectedRequest}
                        onSelect={setSelectedRequest}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        statusFilter={statusFilter}
                        typeFilter={typeFilter}
                        onStatusFilter={setStatusFilter}
                        onTypeFilter={setTypeFilter}
                    />
                    <div className='admin-detail'>
                        {!selectedRequest && (
                            <p className='section-note'>Select a request to review.</p>
                        )}
                        {selectedRequest && (
                            <AuthorRequestDetail
                                request={selectedRequest}
                                accessToken={accessToken}
                                onUpdated={handleRequestUpdated}
                                onApproved={handleRequestApproved}
                                onClose={() => setSelectedRequest(null)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}