import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function BookChapterList({ chapters, isLoading, error, bookId, book, navigate, onChaptersUpdated }) {
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)
    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    const [working, setWorking] = useState(null) // chapter id currently being actioned
    const [actionError, setActionError] = useState(null)

    if (isLoading) return <p>Loading chapters...</p>
    if (error) return <p className='form-error'>{error}</p>

    if (!chapters || chapters.length === 0) {
        return (
            <div>
                <p className='section-note'>No chapters yet. Add your first chapter to get started.</p>
                <button onClick={() => navigate(`/author/books/${bookId}/chapters/new`, { state: { book } })}>
                    + Add Chapter
                </button>
            </div>
        )
    }

    const handleDelete = async (chapter) => {
        if (!window.confirm(`Delete "${chapter.display_title}"? This cannot be undone.`)) return
        setWorking(chapter.id)
        setActionError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterDelete}`, {
                method: 'DELETE',
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
                onChaptersUpdated()
            } else {
                setActionError(data.error || 'Could not delete chapter.')
            }
        } catch {
            setActionError('Unable to connect. Please try again.')
        } finally {
            setWorking(null)
        }
    }

    const handleUnpublish = async (chapter) => {
        if (!window.confirm(`Unpublish "${chapter.display_title}"? Readers who have unlocked it will lose access.`)) return
        setWorking(chapter.id)
        setActionError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.chapterUnpublish}`, {
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
                onChaptersUpdated()
            } else {
                setActionError(data.error || 'Could not unpublish chapter.')
            }
        } catch {
            setActionError('Unable to connect. Please try again.')
        } finally {
            setWorking(null)
        }
    }

    return (
        <div className='chapter-list'>
            {actionError && <p className='form-error'>{actionError}</p>}
            <div className='chapter-list-items'>
                {chapters.map((chapter) => (
                    <div key={chapter.id} className='chapter-list-item'>
                        <div className='chapter-list-item-info'>
                            <span className='chapter-list-title'>{chapter.display_title}</span>
                            <span className='chapter-list-meta'>
                                {chapter.word_count.toLocaleString()} words
                                {chapter.is_free && <span className='chapter-badge chapter-badge--free'>Free</span>}
                                {chapter.is_final && <span className='chapter-badge chapter-badge--final'>Final</span>}
                            </span>
                        </div>
                        <div className='chapter-list-item-actions'>
                            <span className={`project-status ${chapter.status}`}>
                                {chapter.status}
                            </span>
                            <button
                                onClick={() => navigate(
                                    `/author/books/${bookId}/chapters/${chapter.id}/edit`,
                                    { state: { chapter, book } }
                                )}
                                disabled={working === chapter.id}
                            >
                                Edit
                            </button>
                            {chapter.status === 'published' && (
                                <button
                                    onClick={() => handleUnpublish(chapter)}
                                    disabled={working === chapter.id}
                                >
                                    {working === chapter.id ? '...' : 'Unpublish'}
                                </button>
                            )}
                            {chapter.status === 'draft' && (
                                <button
                                    onClick={() => handleDelete(chapter)}
                                    disabled={working === chapter.id}
                                >
                                    {working === chapter.id ? '...' : 'Delete'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate(`/author/books/${bookId}/chapters/new`, { state: { book } })}>
                + Add Chapter
            </button>
        </div>
    )
}