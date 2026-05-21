import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useBookReferenceData from '../../hooks/useBookReferenceData'
import BookDetails from '../../components/AuthorBookComponents/BookDetails'
import BookTags from '../../components/AuthorBookComponents/BookTags'
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

            <section className='manage-book-section'>
                <h2>Chapters</h2>
                <p className='coming-soon-note'>Chapter management coming next.</p>
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


function BookApprovalStatus({ book, authorType, accessToken, onBookUpdated }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.bookSubmit}`, {
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

    if (book.status === 'approved') {
        return <p className='form-success'>This book has been approved and is live.</p>
    }

    if (book.status === 'pending_approval') {
        return <p className='section-note'>Your book is currently under review. We'll notify you once a decision has been made.</p>
    }

    if (book.status === 'rejected') {
        return <p className='form-error'>This book has been rejected. Please contact admin for more information.</p>
    }

    if (book.status === 'draft') {
        return (
            <div>
                <p className='section-note'>Once you're happy with your book details, submit it for admin review.</p>
                {error && <p className='form-error'>{error}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                </button>
            </div>
        )
    }

    if (book.status === 'changes_requested') {
        return (
            <div>
                <p className='section-note'>Admin has requested changes to your book. Make the necessary updates and resubmit when ready.</p>
                {error && <p className='form-error'>{error}</p>}
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Resubmit for Approval'}
                </button>
            </div>
        )
    }

    return null
}