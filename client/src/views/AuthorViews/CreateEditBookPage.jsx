import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'
import TipTapEditor from '../../components/TipTapEditor/TipTapEditor'
import Button from '../../components/ui/Button'

const PAGE_TYPE_LABELS = {
    prologue: 'Prologue',
    authors_note: "Author's Note",
    dedication: 'Dedication',
    acknowledgements: 'Acknowledgements',
    next_book_teaser: 'Next Book Teaser',
}

export default function CreateEditBookPage() {
    const { bookId, pageType } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)
    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const { book, page } = location.state || {}

    const [content, setContent] = useState(page?.content || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const isEditing = !!page
    const label = PAGE_TYPE_LABELS[pageType] || pageType

    if (!book) {
        return (
            <div>
                <p className='form-error'>Book data not found.</p>
                <Button
                    variant='primary'
                    size='sm'
                    onClick={() => navigate(`/author/books/${bookId}/manage`)}
                >
                    ← Back to book
                </Button>
            </div>
        )
    }

    const handleSave = async () => {
        if (!content || content === '<p></p>') {
            setError('Content is required.')
            return
        }
        setIsSubmitting(true)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.pageCreateUpdate}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: Number(bookId),
                    page_type: pageType,
                    content,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                navigate(`/author/books/${bookId}/manage#manage-pages`)
            } else {
                setError(data.error || 'Could not save page.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='create-chapter'>
            <div className='manage-book-header'>
                <Button
                    variant='primary'
                    size='sm'
                    onClick={() => navigate(`/author/books/${bookId}/manage#manage-pages`)}
                >
                    ← Back to book
                </Button>
                <h1>{isEditing ? `Edit ${label}` : `Add ${label}`}</h1>
            </div>

            <div className='create-chapter-form'>
                <div className='bff-field'>
                    <label className='bff-label'>Content <span className='bff-required'>*</span></label>
                    <TipTapEditor
                        content={content}
                        onChange={setContent}
                        disabled={isSubmitting}
                    />
                </div>

                {error && <p className='form-error'>{error}</p>}

                <div className='create-chapter-actions'>
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => navigate(`/author/books/${bookId}/manage#manage-pages`)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}