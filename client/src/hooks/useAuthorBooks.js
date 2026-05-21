import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { DB_API, ENDPOINTS } from '../utils/api'

export default function useAuthorBooks() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const accessToken = useAuthStore((state) => state.accessToken)

    useEffect(() => {
        if (!accessToken) return

        const fetchBooks = async () => {
            try {
                const response = await fetch(`${DB_API}${ENDPOINTS.bookList}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })

                const data = await response.json()

                if (response.ok) {
                    setBooks(data.books)
                } else {
                    setError(data.error || 'Failed to fetch books')
                }
            } catch (err) {
                setError('Something went wrong fetching your books')
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [accessToken])

    // pre-filtered slices for convenience
    const publishedBooks = books.filter(b => b.status === 'approved')
    const draftBooks = books.filter(b => b.status === 'draft')
    const pendingBooks = books.filter(b => b.status === 'pending_approval')
    const changesRequestedBooks = books.filter(b => b.status === 'changes_requested')

    return {
        books,
        publishedBooks,
        draftBooks,
        pendingBooks,
        changesRequestedBooks,
        loading,
        error
    }
}