import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DB_API, ENDPOINTS, getMediaUrl } from '../../utils/api'
import BookDetailHero from '../../components/LibraryComponents/Book/BookDetailHero'
import BookDetailDescription from '../../components/LibraryComponents/Book/BookDetailDescription'
import BookDetailChapters from '../../components/LibraryComponents/Book/BookDetailChapters'
import BookDetailCTA from '../../components/LibraryComponents/Book/BookDetailCTA'
import '../../components/LibraryComponents/Book/bookdetail.css'

export default function BookDetail() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`${DB_API}${ENDPOINTS.publicBookDetail(bookId)}`)
                console.log("status",res.status)
                if (res.status === 404) {
                    setError('not_found')
                    return
                }
                if (!res.ok) {
                    setError('server')
                    return
                }
                const data = await res.json()
                setBook(data)
            } catch {
                setError('network')
            } finally {
                setIsLoading(false)
            }
        }
        fetchBook()
    }, [bookId])

    if (isLoading) {
        return (
            <div className='bd-page'>
                <div className='bd-loading'>Loading book details…</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='bd-page'>
                <div className='bd-error'>
                    <p>
                        {error === 'not_found'
                            ? 'This book could not be found.'
                            : 'Something went wrong loading this book. Please try again.'}
                    </p>
                    <button className='bd-back-btn' onClick={() => navigate('/library')}>
                        ← Back to Library
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='bd-page'>
            <div className='bd-inner'>
                <button className='bd-back-btn' onClick={() => navigate('/library')}>
                    ← Back to Library
                </button>
                <BookDetailHero book={book} />
                <BookDetailDescription description={book.description} />
                <BookDetailChapters chapters={book.chapters} />
                <BookDetailCTA title={book.title} />
            </div>
        </div>
    )
}