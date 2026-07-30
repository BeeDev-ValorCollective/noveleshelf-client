import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import TipTapEditor from '../../components/TipTapEditor/TipTapEditor'
import Button from '../../components/ui/Button'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function EditChapter() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const { chapter, book } = location.state || {}

    const [formData, setFormData] = useState({
        title: chapter?.title || '',
        content: chapter?.content || '',
        is_final: chapter?.is_final || false,
        unlock_cost: chapter?.unlock_cost || 0,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    if (!chapter || !book) {
        return (
            <div>
                <p className='form-error'>Chapter data not found.</p>
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

    const onChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleUpdate = async () => {
        if (!formData.content || formData.content === '<p></p>') {
            setError('Content is required.')
            return
        }

        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterUpdate}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chapter_id: chapter.id,
                    title: formData.title || '',
                    content: formData.content,
                    is_final: formData.is_final,
                    ...(authorType === 'paid' && { unlock_cost: formData.unlock_cost }),
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Chapter saved successfully.')
            } else {
                setError(data.error || 'Could not save chapter.')
            }
        } catch {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        setError(null)
        setSuccess(null)

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterPublish}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chapter_id: chapter.id,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                navigate(`/author/books/${bookId}/manage`)
            } else {
                setError(data.error || 'Could not publish chapter.')
            }
        } catch {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsPublishing(false)
        }
    }

    const bookIsApproved = book.status === 'approved'
    const hasMultipleChapters = chapter.chapter_number > 1

    return (
        <div className="create-chapter">
            <div className="manage-book-header">
                <Button
                    variant='primary'
                    size='sm'
                    onClick={() => navigate(`/author/books/${bookId}/manage#chapter-${bookId}`)}
                >
                    ← Back to book
                </Button>
                <h1>{chapter.display_title}</h1>
                <span className={`project-status ${chapter.status}`}>{chapter.status}</span>
            </div>

            <div className="create-chapter-form">
                <div className="create-chapter-actions">
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleUpdate}
                        disabled={isSubmitting || isPublishing}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {bookIsApproved && chapter.status !== 'published' && (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={handlePublish}
                            disabled={isSubmitting || isPublishing}
                        >
                            {isPublishing ? 'Publishing...' : 'Publish Chapter'}
                        </Button>
                    )}
                </div>

                <div className="bff-field">
                    <label className="bff-label" htmlFor="title">
                        Title <span className="bff-hint-inline">(optional)</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="bff-input"
                        value={formData.title}
                        onChange={(e) => onChange('title', e.target.value)}
                        placeholder="Leave blank to display as 'Chapter N'"
                        maxLength={200}
                        disabled={isSubmitting || isPublishing}
                    />
                </div>

                <div className="bff-field">
                    <label className="bff-label">Content <span className="bff-required">*</span></label>
                    <TipTapEditor
                        content={formData.content}
                        onChange={(val) => onChange('content', val)}
                        disabled={isSubmitting || isPublishing}
                    />
                </div>

                {authorType === 'paid' && (
                    <p className="bff-hint">
                        {chapter.status === 'published'
                            ? `Unlock cost: ${chapter.unlock_cost === 0 ? 'Free' : `${chapter.unlock_cost} quills`} — locked in at time of publishing.`
                            : `Unlock cost is calculated automatically based on book tier and word count.`
                        }
                    </p>
                )}

                {hasMultipleChapters && (
                    <div className="bff-field bff-field--toggle">
                        <label className="bff-label bff-label--toggle" htmlFor="is_final">
                            <input
                                id="is_final"
                                type="checkbox"
                                checked={formData.is_final}
                                onChange={(e) => onChange('is_final', e.target.checked)}
                                disabled={isSubmitting || isPublishing || chapter.is_final}
                            />
                            Mark as final chapter
                        </label>
                        {chapter.is_final
                            ? <p className="bff-hint">This chapter is already marked as final and cannot be changed.</p>
                            : <p className="bff-warning">⚠️ This permanently marks the book as complete. This cannot be undone.</p>
                        }
                    </div>
                )}

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <div className="create-chapter-actions">
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => navigate(`/author/books/${bookId}/manage#chapter-${bookId}`)}
                        disabled={isSubmitting || isPublishing}
                    >
                        ← Back to book
                    </Button>
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleUpdate}
                        disabled={isSubmitting || isPublishing}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {bookIsApproved && chapter.status !== 'published' && (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={handlePublish}
                            disabled={isSubmitting || isPublishing}
                        >
                            {isPublishing ? 'Publishing...' : 'Publish Chapter'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}