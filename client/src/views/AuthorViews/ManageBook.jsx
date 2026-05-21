import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useBookReferenceData from '../../hooks/useBookReferenceData'
import BookDetails from '../../components/AuthorBookComponents/BookDetails'
import BookTags from '../../components/AuthorBookComponents/BookTags'
import BookApprovalStatus from '../../components/AuthorBookComponents/BookApprovalStatus'
import BookChapterList from '../../components/AuthorBookComponents/BookChapterList'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'

import '../../components/AuthorBookComponents/authorBook.css'

export default function ManageBook() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const { genres, keywords, relationship_tags, content_ratings, isLoading: refLoading } = useBookReferenceData()

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [chapters, setChapters] = useState([])
    const [chaptersLoading, setChaptersLoading] = useState(true)
    const [chaptersError, setChaptersError] = useState(null)

    const fetchBook = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const url = `${DB_API}${ENDPOINTS.bookDetail(bookId)}${authorType ? `?author_type=${authorType}` : ''}`
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setBook(data.book)
            } else {
                setError(data.error || 'Could not load book.')
            }
        } catch {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchChapters = async () => {
        setChaptersLoading(true)
        setChaptersError(null)
        try {
            const params = new URLSearchParams({ book_id: bookId })
            if (authorType) params.append('author_type', authorType)
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterList}?${params}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setChapters(data.chapters)
            } else {
                setChaptersError(data.error || 'Could not load chapters.')
            }
        } catch {
            setChaptersError('Unable to connect. Please check your connection and try again.')
        } finally {
            setChaptersLoading(false)
        }
    }

    useEffect(() => {
        if (bookId && accessToken) {
            fetchBook()
            fetchChapters()
        }
    }, [bookId, accessToken])

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>{error}</p>
    if (!book) return null

    return (
        <div className='manage-book'>
            <div className='manage-book-header'>
                <button onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
                <h1>{book.title}</h1>
                <span className={`project-status ${book.status}`}>{book.status.replace(/_/g, ' ')}</span>
            </div>

            <BookDetails
                book={book}
                authorType={authorType}
                accessToken={accessToken}
                contentRatings={content_ratings}
                refLoading={refLoading}
                onBookUpdated={setBook}
            />

            <BookTags
                book={book}
                authorType={authorType}
                accessToken={accessToken}
                allGenres={genres}
                allKeywords={keywords}
                allRelationshipTags={relationship_tags}
                onBookUpdated={setBook}
            />

            <section className='manage-book-section'>
                <h2>Chapters</h2>
                <BookChapterList
                    chapters={chapters}
                    isLoading={chaptersLoading}
                    error={chaptersError}
                    bookId={bookId}
                    book={book}
                    navigate={navigate}
                />
            </section>

            <section className='manage-book-section'>
                <h2>Book Pages</h2>
                <p className='coming-soon-note'>Page management coming next.</p>
            </section>

            {currentRole === 'author' && (
                <section className='manage-book-section'>
                    <h2>Approval Status</h2>
                    <BookApprovalStatus
                        book={book}
                        authorType={authorType}
                        accessToken={accessToken}
                        onBookUpdated={setBook}
                    />
                </section>
            )}
        </div>
    )
}