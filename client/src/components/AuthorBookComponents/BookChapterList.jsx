import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { ROLE_TO_AUTHOR_TYPE } from '../../utils/auth'
import { DB_API, ENDPOINTS } from '../../utils/api'
import Button from '../ui/Button'

export default function BookChapterList({
    chapters,
    isLoading,
    error,
    bookId,
    book,
    navigate,
    onChaptersUpdated,
}) {
    const accessToken = useAuthStore((state) => state.accessToken)
    const currentRole = useAuthStore((state) => state.currentRole)
    const authorType = ROLE_TO_AUTHOR_TYPE[currentRole]

    // Stores the ID of the chapter currently being updated.
    const [working, setWorking] = useState(null)
    const [workingAction, setWorkingAction] = useState(null)
    const [actionError, setActionError] = useState(null)

    if (isLoading) {
        return <p>Loading chapters...</p>
    }

    if (error) {
        return <p className='form-error'>{error}</p>
    }

    if (!chapters || chapters.length === 0) {
        return (
            <div>
                <p className='section-note'>
                    No chapters yet. Add your first chapter to get started.
                </p>

                <Button
                    variant='tertiary'
                    size='md'
                    onClick={() =>
                        navigate(
                            `/author/books/${bookId}/chapters/new`,
                            { state: { book } }
                        )
                    }
                >
                    + Add Chapter
                </Button>
            </div>
        )
    }

    const startAction = (chapterId, action) => {
        setWorking(chapterId)
        setWorkingAction(action)
        setActionError(null)
    }

    const finishAction = () => {
        setWorking(null)
        setWorkingAction(null)
    }

    const handlePublish = async (chapter) => {
        if (
            !window.confirm(
                `Publish "${chapter.display_title}"? It will become available to readers.`
            )
        ) {
            return
        }

        startAction(chapter.id, 'publish')

        try {
            const res = await fetch(
                `${DB_API}${ENDPOINTS.chapterPublish}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapter_id: chapter.id,
                        author_type: authorType,
                    }),
                }
            )

            const data = await res.json()

            if (res.ok) {
                await onChaptersUpdated()
            } else {
                setActionError(
                    data.error || 'Could not publish chapter.'
                )
            }
        } catch {
            setActionError(
                'Unable to connect. Please check your connection and try again.'
            )
        } finally {
            finishAction()
        }
    }

    const handleUnpublish = async (chapter) => {
        if (
            !window.confirm(
                `Unpublish "${chapter.display_title}"? Readers who have unlocked it will lose access.`
            )
        ) {
            return
        }

        startAction(chapter.id, 'unpublish')

        try {
            const res = await fetch(
                `${DB_API}${ENDPOINTS.chapterUnpublish}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapter_id: chapter.id,
                        author_type: authorType,
                    }),
                }
            )

            const data = await res.json()

            if (res.ok) {
                await onChaptersUpdated()
            } else {
                setActionError(
                    data.error || 'Could not unpublish chapter.'
                )
            }
        } catch {
            setActionError(
                'Unable to connect. Please try again.'
            )
        } finally {
            finishAction()
        }
    }

    const handleDelete = async (chapter) => {
        if (
            !window.confirm(
                `Delete "${chapter.display_title}"? This cannot be undone.`
            )
        ) {
            return
        }

        startAction(chapter.id, 'delete')

        try {
            const res = await fetch(
                `${DB_API}${ENDPOINTS.chapterDelete}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chapter_id: chapter.id,
                        author_type: authorType,
                    }),
                }
            )

            const data = await res.json()

            if (res.ok) {
                await onChaptersUpdated()
            } else {
                setActionError(
                    data.error || 'Could not delete chapter.'
                )
            }
        } catch {
            setActionError(
                'Unable to connect. Please try again.'
            )
        } finally {
            finishAction()
        }
    }

    const bookIsApproved = book?.status === 'approved'

    return (
        <div className='chapter-list'>
            {actionError && (
                <p className='form-error'>{actionError}</p>
            )}

            <div className='chapter-list-items'>
                {chapters.map((chapter) => {
                    const isWorking = working === chapter.id

                    return (
                        <div
                            key={chapter.id}
                            className='chapter-list-item'
                            id={`chapter-${chapter.id}`}
                        >
                            <div className='chapter-list-item-info'>
                                <span className='chapter-list-title'>
                                    {chapter.display_title}
                                </span>

                                <span className='chapter-list-meta'>
                                    {(chapter.word_count ?? 0).toLocaleString()} words

                                    {chapter.is_free && (
                                        <span className='chapter-badge chapter-badge--free'>
                                            Free
                                        </span>
                                    )}

                                    {chapter.is_final && (
                                        <span className='chapter-badge chapter-badge--final'>
                                            Final
                                        </span>
                                    )}
                                </span>
                            </div>

                            <div className='chapter-list-item-actions'>
                                <span
                                    className={`project-status ${chapter.status}`}
                                >
                                    {chapter.status}
                                </span>

                                <Button
                                    variant='primary'
                                    size='sm'
                                    onClick={() =>
                                        navigate(
                                            `/author/books/${bookId}/chapters/${chapter.id}/edit`,
                                            { state: { chapter, book } }
                                        )
                                    }
                                    disabled={isWorking}
                                >
                                    Edit
                                </Button>

                                {bookIsApproved &&
                                    chapter.status !== 'published' && (
                                        <Button
                                            variant='secondary'
                                            size='sm'
                                            onClick={() =>
                                                handlePublish(chapter)
                                            }
                                            disabled={isWorking}
                                        >
                                            {isWorking &&
                                            workingAction === 'publish'
                                                ? 'Publishing...'
                                                : 'Publish'}
                                        </Button>
                                    )}

                                {chapter.status === 'published' && (
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            handleUnpublish(chapter)
                                        }
                                        disabled={isWorking}
                                    >
                                        {isWorking &&
                                        workingAction === 'unpublish'
                                            ? 'Unpublishing...'
                                            : 'Unpublish'}
                                    </Button>
                                )}

                                {chapter.status === 'draft' && (
                                    <Button
                                        variant='primary'
                                        size='sm'
                                        onClick={() =>
                                            handleDelete(chapter)
                                        }
                                        disabled={isWorking}
                                    >
                                        {isWorking &&
                                        workingAction === 'delete'
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <Button
                variant='tertiary'
                size='md'
                onClick={() =>
                    navigate(
                        `/author/books/${bookId}/chapters/new`,
                        { state: { book } }
                    )
                }
            >
                + Add Chapter
            </Button>
        </div>
    )
}