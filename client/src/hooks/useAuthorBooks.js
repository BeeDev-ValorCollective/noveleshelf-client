import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { ROLE_TO_AUTHOR_TYPE } from '../utils/auth'
import { DB_API, ENDPOINTS } from '../utils/api'

export default function useAuthorBooks() {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    useEffect(() => {
        if (!accessToken || !authorType) return

        const fetchBooks = async () => {
            try {
                const response = await fetch(`${DB_API}${ENDPOINTS.bookList}?author_type=${authorType}`, {
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
            } catch {
                setError('Something went wrong fetching your books')
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [accessToken, authorType])

    const currentProjects = books.filter(b =>
        ['draft', 'pending_approval', 'changes_requested', 'rejected'].includes(b.status)
    )
    const publishedBooks = books.filter(b => b.status === 'approved' && !b.is_complete)
    const finishedBooks = books.filter(b => b.status === 'approved' && b.is_complete)

    // keep these for StatsBar
    const draftBooks = books.filter(b => b.status === 'draft')
    const pendingBooks = books.filter(b => b.status === 'pending_approval')
    const changesRequestedBooks = books.filter(b => b.status === 'changes_requested')

    return {
        books,
        currentProjects,
        publishedBooks,
        finishedBooks,
        draftBooks,
        pendingBooks,
        changesRequestedBooks,
        loading,
        error
    }
}