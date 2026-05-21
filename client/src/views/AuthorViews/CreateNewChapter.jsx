import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import TipTapEditor from '../../components/TipTapEditor/TipTapEditor'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function CreateNewChapter({ book }) {
    const { bookId } = useParams()
    const navigate = useNavigate()
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)

    // Determine if user has both profiles
    const hasBothProfiles = currentRole === 'both' // adjust to match your actual role value

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_final: false,
        author_type: hasBothProfiles ? '' : currentRole === 'free_author' ? 'free' : 'paid',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const hasChapters = book?.chapter_count > 0  // adjust field name to match your book object

    const onChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.content || formData.content === '<p></p>') {
            setError('Content is required.')
            return
        }
        if (hasBothProfiles && !formData.author_type) {
            setError('Please select which author profile to publish under.')
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
                    author_type: formData.author_type,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                navigate(`/books/${bookId}/manage`)
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
                <button onClick={() => navigate(`/author/books/${bookId}/manage`)}>← Back to book</button>
                <h1>Add New Chapter</h1>
            </div>

            <div className="create-chapter-form">

                {hasBothProfiles && (
                    <div className="bff-field">
                        <label className="bff-label" htmlFor="author_type">
                            Publishing as <span className="bff-required">*</span>
                        </label>
                        <select
                            id="author_type"
                            className="bff-select"
                            value={formData.author_type}
                            onChange={(e) => onChange('author_type', e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="">Select author profile</option>
                            <option value="paid">Paid Author</option>
                            <option value="free">Free Author</option>
                        </select>
                    </div>
                )}

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
                    <button onClick={() => navigate(`/authors/books/${bookId}/manage`)} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Chapter'}
                    </button>
                </div>
            </div>
        </div>
    )
}