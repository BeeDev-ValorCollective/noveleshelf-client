import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useBookReferenceData from '../../hooks/useBookReferenceData'
import BookDetails from '../../components/AuthorBookComponents/BookDetails'
import BookTags from '../../components/AuthorBookComponents/BookTags'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'


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
        } catch (err) {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (bookId && accessToken) fetchBook()
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

            {currentRole === 'author' && (
                <section className='manage-book-section'>
                    <h2>Chapters</h2>
                    <p className='coming-soon-note'>Chapter management coming next.</p>
                </section>
            )}

            {currentRole === 'free_author' && (
                <section className='manage-book-section'>
                    <h2>Chapters</h2>
                    <p className='coming-soon-note'>Chapter management coming next.</p>
                </section>
            )}

            <section className='manage-book-section'>
                <h2>Book Pages</h2>
                <p className='coming-soon-note'>Page management coming next.</p>
            </section>

            {currentRole === 'author' && book.status === 'draft' && (
                <section className='manage-book-section'>
                    <h2>Submit for Approval</h2>
                    <p>Once you're happy with your book details, submit it for admin review.</p>
                    <SubmitBookButton
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


function SubmitBookButton({ book, authorType, accessToken, onBookUpdated }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(DB_API + 'books/author/books/submit/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: book.id,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Book submitted for approval.')
                onBookUpdated(data.book)
            } else {
                setError(data.error || 'Could not submit book.')
            }
        } catch (err) {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            {error && <p className='form-error'>{error}</p>}
            {success && <p className='form-success'>{success}</p>}
            <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
        </div>
    )
}