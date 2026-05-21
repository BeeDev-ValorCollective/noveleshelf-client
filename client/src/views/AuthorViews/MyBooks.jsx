import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import BookCard from '../../components/BookComponents/BookCard'
import BooksFilterSort from '../../components/BookComponents/BooksFilterSort'
import { sortBooks } from '../../utils/books'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../utils/api'


export default function MyBooks() {
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)
    const navigate = useNavigate()

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortValue, setSortValue] = useState('created_at_desc')

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const url = `${DB_API}${ENDPOINTS.bookList}${authorType ? `?author_type=${authorType}` : ''}`
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                const data = await res.json()
                if (res.ok) {
                    setBooks(data.books)
                } else {
                    setError(data.error || 'Could not load books.')
                }
            } catch (err) {
                setError('Unable to connect. Please check your connection and try again.')
            } finally {
                setIsLoading(false)
            }
        }

        if (accessToken) fetchBooks()
    }, [accessToken])

    const filtered = statusFilter === 'all'
        ? books
        : books.filter((b) => b.status === statusFilter)

    const sorted = sortBooks(filtered, sortValue)

    const handleBookClick = (book) => {
        navigate(`/author/my-books/${book.id}`, { state: { book } })
    }

    if (isLoading) return <p>Loading your books...</p>
    if (error) return <p>{error}</p>

    return (
        <div className='my-books'>
            <div className='my-books-header'>
                <h1>My Books</h1>
                <a href='/author/create-book' className='cb-btn cb-btn--primary'>+ New Book</a>
            </div>

            <BooksFilterSort
                books={books}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortValue={sortValue}
                onSortChange={setSortValue}
            />

            {sorted.length === 0 ? (
                <p className='my-books-empty'>
                    {statusFilter === 'all'
                        ? "You haven't created any books yet."
                        : `No books with that status.`}
                </p>
            ) : (
                <div className='my-books-list'>
                    {sorted.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onClick={handleBookClick}
                            actions={(book) => (
                                <a href={`/author/books/${book.id}/manage`} className='cb-btn cb-btn--secondary'>
                                    Manage Book
                                </a>
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}