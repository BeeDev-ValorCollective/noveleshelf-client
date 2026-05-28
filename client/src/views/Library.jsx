import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS, getMediaUrl } from '../utils/api'
import LibraryBookModal from '../components/LibraryComponents/LibraryBookModal'
import LibraryEmptyState from '../components/LibraryComponents/LibraryEmptyState'
import '../components/LibraryComponents/library.css'

export default function Library() {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedBook, setSelectedBook] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchBooks = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.library}?page=${page}`)
            const data = await res.json()
            if (res.ok) {
                setBooks(prev => page === 1 ? data.results : [...prev, ...data.results])
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
        document.querySelector('main')?.classList.add('main--full-width')
        return () => document.querySelector('main')?.classList.remove('main--full-width')
    }, [])

    useEffect(() => {
        fetchBooks()
    }, [page])

    if (isLoading && page === 1) return <LibraryEmptyState loading />
    if (error) return <p className='library-error'>{error}</p>
    if (!isLoading && books.length === 0) return <LibraryEmptyState />

    return (
        <div className='library-page'>
            <div className='library-header'>
                <h1>The Shelf</h1>
                <p>Discover stories waiting to be read</p>
            </div>

            <ul className='book-grid'>
                {books.map((book) => (
                    <li key={book.id} onClick={() => setSelectedBook(book)}>
                        <img
                            src={getMediaUrl(book.cover_image)}
                            alt={book.title}
                        />
                        <span className='bookTitle'>{book.title}</span>
                        {book.is_complete && (
                            <span className='book-complete-badge'>✓ Complete</span>
                        )}
                    </li>
                ))}
            </ul>

            {page < totalPages && (
                <div className='library-load-more'>
                    <button onClick={() => setPage(p => p + 1)} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Load more'}
                    </button>
                </div>
            )}

            {selectedBook && (
                <LibraryBookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </div>
    )
}