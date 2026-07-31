import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import TipTapEditor from '../../components/TipTapEditor/TipTapEditor'
import Button from '../../components/ui/Button'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'
import './authorViews.css'

export default function CreateNewChapter() {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]
    const { book } = location.state || {}

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_final: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const hasChapters = book?.chapters?.length > 0

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

    const onChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.content || formData.content === '<p></p>') {
            setError('Content is required.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterCreate}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    book_id: Number(bookId),
                    title: formData.title || undefined,
                    content: formData.content,
                    is_final: formData.is_final,
                    author_type: authorType,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                navigate(`/author/books/${bookId}/manage#manage-chapters`)
            } else {
                setError(data.error || 'Could not create chapter.')
            }
        } catch {
            setError('Unable to connect. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="create-chapter">
            <div className="manage-book-header">
                <Button
                    variant='primary'
                    size='sm'
                    onClick={() => navigate(`/author/books/${bookId}/manage#manage-chapters`)}
                >
                    ← Back to book
                </Button>
                <h1>Add New Chapter</h1>
            </div>

            <div className="create-chapter-form">
                <div className="create-chapter-actions">
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Chapter'}
                    </Button>
                </div>

                <div className="bff-field">
                    <label className="bff-label" htmlFor="title">Title <span className="bff-hint-inline">(optional)</span></label>
                    <input
                        id="title"
                        type="text"
                        className="bff-input"
                        value={formData.title}
                        onChange={(e) => onChange('title', e.target.value)}
                        placeholder="Leave blank to display as 'Chapter N'"
                        maxLength={200}
                        disabled={isSubmitting}
                    />
                </div>

                <div className="bff-field">
                    <label className="bff-label">Content <span className="bff-required">*</span></label>
                    <TipTapEditor
                        content={formData.content}
                        onChange={(val) => onChange('content', val)}
                        disabled={isSubmitting}
                    />
                </div>

                {hasChapters && (
                    <div className="bff-field bff-field--toggle">
                        <label className="bff-label bff-label--toggle" htmlFor="is_final">
                            <input
                                id="is_final"
                                type="checkbox"
                                checked={formData.is_final}
                                onChange={(e) => onChange('is_final', e.target.checked)}
                                disabled={isSubmitting}
                            />
                            Mark as final chapter
                        </label>
                        <p className="bff-warning">
                            ⚠️ This permanently marks the book as complete. This cannot be undone.
                        </p>
                    </div>
                )}

                {error && <p className="form-error">{error}</p>}

                <div className="create-chapter-actions">
                    <Button
                        variant='primary'
                        size='sm'
                        onClick={() => navigate(`/author/books/${bookId}/manage#manage-chapters`)}
                        disabled={isSubmitting}
                    >
                        ← Back to book
                    </Button>
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Chapter'}
                    </Button>
                </div>
            </div>
        </div>
    )
}