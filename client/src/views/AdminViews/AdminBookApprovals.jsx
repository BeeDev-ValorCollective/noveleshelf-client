import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import BookApprovalList from '../../components/AdminComponents/BookApprovalList'
import BookApprovalDetail from '../../components/AdminComponents/BookApprovalDetail'
import '../../components/AdminComponents/adminComponents.css'

export default function AdminBookApprovals() {
    const navigate = useNavigate()
    const accessToken = useAuthStore((state) => state.accessToken)

    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('pending_approval')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedBook, setSelectedBook] = useState(null)

    const fetchBooks = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({ page })
            if (statusFilter) params.append('status', statusFilter)
            const res = await fetch(`${DB_API}${ENDPOINTS.adminBooks}?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setBooks(data.results)
                setTotalPages(data.total_pages)
            } else {
                setError(data.error || 'Could not load books.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (accessToken) fetchBooks()
    }, [accessToken, statusFilter, page])

    const handleBookUpdated = (updatedBook) => {
        setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b))
        setSelectedBook(updatedBook)
    }

    const handleBookActioned = (updatedBook) => {
        setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b))
        setSelectedBook(null)
    }

    return (
        <div className='admin-page'>
            <div className='admin-page-header'>
                <button onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
                <h1>Book Approvals</h1>
            </div>

            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}

            {!isLoading && !error && (
                <div className='admin-layout'>
                    <BookApprovalList
                        books={books}
                        selectedBook={selectedBook}
                        onSelect={setSelectedBook}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        statusFilter={statusFilter}
                        onStatusFilter={setStatusFilter}
                    />
                    <div className='admin-detail'>
                        {!selectedBook && (
                            <p className='section-note'>Select a book to review.</p>
                        )}
                        {selectedBook && (
                            <BookApprovalDetail
                                book={selectedBook}
                                accessToken={accessToken}
                                onUpdated={handleBookUpdated}
                                onActioned={handleBookActioned}
                                onClose={() => setSelectedBook(null)}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}