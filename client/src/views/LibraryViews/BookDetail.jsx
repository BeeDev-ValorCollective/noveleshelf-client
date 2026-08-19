import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button'

import {
    useParams,
    useNavigate,
    useLocation,
} from 'react-router-dom'

import { DB_API, ENDPOINTS } from '../../utils/api'
import { sendToExpo } from '../../utils/authHandoff'
import useAuthStore from '../../store/authStore'

import BookDetailHero from '../../components/LibraryComponents/Book/BookDetailHero'
import BookDetailDescription from '../../components/LibraryComponents/Book/BookDetailDescription'
import BookDetailChapters from '../../components/LibraryComponents/Book/BookDetailChapters'
import BookDetailCTA from '../../components/LibraryComponents/Book/BookDetailCTA'

import '../../components/LibraryComponents/Book/bookdetail.css'

const BACK_LABELS = {
    '/': '← Back to Home',
    '/library': '← Back to Library',
}

export default function BookDetail() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    )

    const accessToken = useAuthStore(
        (state) => state.accessToken
    )

    const currentRole = useAuthStore(
        (state) => state.currentRole
    )

    const setCurrentRole = useAuthStore(
        (state) => state.setCurrentRole
    )

    const [book, setBook] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    /*
     * null means the shelf status has not been checked yet.
     */
    const [isInShelf, setIsInShelf] = useState(null)

    const backTo =
        location.state?.backTo || '/library'

    const backLabel =
        BACK_LABELS[backTo] || '← Back'

    useEffect(() => {
        const fetchBook = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${DB_API}${ENDPOINTS.publicBookDetail(
                        bookId
                    )}`
                )

                if (response.status === 404) {
                    setError('not_found')
                    return
                }

                if (!response.ok) {
                    setError('server')
                    return
                }

                const data = await response.json()

                setBook(data)
            } catch {
                setError('network')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBook()
    }, [bookId])

    /*
     * The public book endpoint does not know whether this
     * particular reader owns the book, so check the protected
     * reader endpoint separately when logged in.
     */
    useEffect(() => {
        const checkShelfStatus = async () => {
            if (!isAuthenticated || !accessToken) {
                setIsInShelf(false)
                return
            }

            setIsInShelf(null)

            try {
                const response = await fetch(
                    `${DB_API}${ENDPOINTS.readerBookDetail(
                        bookId
                    )}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${accessToken}`,
                        },
                    }
                )

                if (!response.ok) {
                    console.error(
                        'Unable to check shelf status:',
                        response.status
                    )

                    setIsInShelf(false)
                    return
                }

                const data = await response.json()

                setIsInShelf(Boolean(data.in_shelf))
            } catch (error) {
                console.error(
                    'Shelf status request failed:',
                    error
                )

                setIsInShelf(false)
            }
        }

        checkShelfStatus()
    }, [
        bookId,
        isAuthenticated,
        accessToken,
    ])

    const switchToReaderRole = () => {
        if (currentRole !== 'reader') {
            setCurrentRole('reader')
        }
    }

    const handleChapterClick = async (chapter) => {
        /*
         * Logged-out readers remain on the Vite details page.
         */
        if (!isAuthenticated) {
            return
        }

        /*
         * Prevent navigation while the shelf check is still
         * loading.
         */
        if (isInShelf === null) {
            return
        }

        switchToReaderRole()

        if (isInShelf) {
            /*
             * The book is already on the shelf, so open the
             * selected chapter in the Expo reader.
             */
            await sendToExpo(
                `(protected)/(reader-tabs)/reading` +
                    `?bookId=${book.id}` +
                    `&chapterId=${chapter.id}`
            )

            return
        }

        /*
         * The book is not on the shelf, so open the Expo
         * book-details page where it can be added.
         */
        await sendToExpo(
            `(protected)/(reader-tabs)/book/${book.id}`
        )
    }

    if (isLoading) {
        return (
            <div className='bd-page'>
                <div className='bd-loading'>
                    Loading book details…
                </div>
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

                    <Button
                        variant='primary'
                        size='sm'
                        className='bd-back-btn'
                        onClick={() => navigate(backTo)}
                    >
                        {backLabel}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className='bd-page'>
            <div className='bd-inner'>
                <Button
                    variant='primary'
                    size='sm'
                    className='bd-back-btn'
                    onClick={() => navigate(backTo)}
                >
                    {backLabel}
                </Button>

                <BookDetailHero book={book} />

                <BookDetailDescription
                    description={book.description}
                />

                <BookDetailChapters
                    chapters={book.chapters}
                    isAuthenticated={isAuthenticated}
                    isInShelf={isInShelf}
                    onChapterClick={handleChapterClick}
                />

                <BookDetailCTA
                    title={book.title}
                />
            </div>
        </div>
    )
}