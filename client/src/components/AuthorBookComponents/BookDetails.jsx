import { useState, useEffect } from 'react'
import { getMediaUrl, DB_API, ENDPOINTS } from '../../utils/api'
import BookFormFields from './BookFormFields'
import useFileInput from '../../hooks/useFileInput'
import Button from '../ui/Button'

export default function BookDetails({ book, authorType, accessToken, contentRatings, refLoading, onBookUpdated }) {
    const [formData, setFormData] = useState({
        title: book.title || '',
        description: book.description || '',
        content_rating_id: book.content_rating?.id ? String(book.content_rating.id) : '',
    })
    const [coverPreview, setCoverPreview] = useState(
        book.cover_image ? getMediaUrl(book.cover_image) : null
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const { file: coverFile, error: coverError, handleChange: handleCoverChange } = useFileInput(5)

    useEffect(() => {
        if (coverFile) {
            const url = URL.createObjectURL(coverFile)
            setCoverPreview(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [coverFile])

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setSuccess(null)
    }

    const handleSave = async () => {
        setError(null)
        setSuccess(null)

        if (!formData.title.trim()) {
            setError('Title is required.')
            return
        }
        if (coverError) {
            setError(coverError)
            return
        }

        setIsSubmitting(true)

        const payload = new FormData()
        payload.append('book_id', book.id)
        payload.append('author_type', authorType)
        payload.append('title', formData.title.trim())

        if (formData.description.trim()) {
            payload.append('description', formData.description.trim())
        }
        if (formData.content_rating_id) {
            payload.append('content_rating_id', formData.content_rating_id)
        }
        if (coverFile) {
            payload.append('cover_image', coverFile)
        }

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.bookUpdate}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: payload,
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Book details saved.')
                onBookUpdated(data.book)
                setCoverPreview(data.book.cover_image ? getMediaUrl(data.book.cover_image) : null)
            } else {
                setError(data.error || 'Could not save changes.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isRejected = book.status === 'rejected'

    return (
        <section className='manage-book-section'>
            <h2>Book Details</h2>
            {isRejected && (
                <p className='form-error'>This book has been rejected and cannot be edited.</p>
            )}
            <BookFormFields
                formData={formData}
                onChange={handleChange}
                contentRatings={contentRatings}
                isLoading={refLoading}
                disabled={isSubmitting || isRejected}
                coverPreview={coverPreview}
                onCoverChange={handleCoverChange}
                coverError={coverError}
            />
            {error && <p className='form-error'>{error}</p>}
            {success && <p className='form-success'>{success}</p>}
            {!isRejected && (
                <Button
                    variant='primary'
                    size='md'
                    onClick={handleSave}
                    disabled={isSubmitting || !formData.title.trim()}
                >
                    {isSubmitting ? 'Saving...' : 'Save Details'}
                </Button>
            )}
        </section>
    )
}