import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import useBookReferenceData from '../../hooks/useBookReferenceData'
import BookFormFields from '../../components/AuthorBookComponents/BookFormFields'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'


export default function CreateNewBook() {
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)
    const { content_ratings, isLoading, error: refError } = useBookReferenceData()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content_rating_id: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
 
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

        const handleSubmit = async () => {
        setError(null)
 
        if (!formData.title.trim()) {
            setError('Title is required.')
            return
        }
 
        const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]
        if (!authorType) {
            setError('You must be logged in as an author to create a book.')
            return
        }
 
        setIsSubmitting(true)
 
        const payload = new FormData()
        payload.append('author_type', authorType)
        payload.append('title', formData.title.trim())
        payload.append('free_chapters', '3')
 
        if (formData.description.trim()) {
            payload.append('description', formData.description.trim())
        }
        if (formData.content_rating_id) {
            payload.append('content_rating_id', formData.content_rating_id)
        }
 
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.bookCreate}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: payload,
            })
 
            const data = await res.json()
 
            if (res.ok) {
                window.location.href = `/author/books/${data.book.id}/manage`
            } else {
                setError(data.error || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return(
        <div className="create-book">
            <div className="cb-header">
                <h1 className="cb-title">Create a new book</h1>
                <p className="cb-subtitle">
                    Fill in the basics to get started. You'll add genres, tags, keywords, and chapters in the next step.
                </p>
            </div>
 
            {refError && (
                <p className="cb-alert cb-alert--warning">
                    Could not load content ratings. You can still create your book and add a rating later.
                </p>
            )}
 
            <div className="cb-form">
                <BookFormFields
                    formData={formData}
                    onChange={handleChange}
                    contentRatings={content_ratings}
                    isLoading={isLoading}
                    disabled={isSubmitting}
                />
 
                {error && <p className="cb-alert cb-alert--error">{error}</p>}
 
                <div className="cb-actions">
                    <a href="/author/dashboard" className="cb-btn cb-btn--secondary">
                        Cancel
                    </a>
                    <button
                        className="cb-btn cb-btn--primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.title.trim()}
                    >
                        {isSubmitting ? 'Creating...' : 'Create book'}
                    </button>
                </div>
            </div>
        </div>
    )
}