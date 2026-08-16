function formatPublishedDate(publishedAt) {
    if (!publishedAt) return null

    const date = new Date(publishedAt)

    if (Number.isNaN(date.getTime())) {
        return null
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date)
}

export default function BookDetailChapters({
    chapters,
    isAuthenticated,
    isInShelf,
    onChapterClick,
}) {
    if (!chapters?.length) {
        return null
    }

    const shelfStatusLoading =
        isAuthenticated && isInShelf === null

    return (
        <div className='bd-section'>
            <h2 className='bd-section-title'>
                Chapters
            </h2>

            <div className='bd-chapter-list'>
                {chapters.map((chapter) => (
                    <button
                        key={chapter.id}
                        type='button'
                        className={[
                            'bd-chapter-item',
                            !isAuthenticated
                                ? 'bd-chapter-item--inactive'
                                : '',
                            shelfStatusLoading
                                ? 'bd-chapter-item--loading'
                                : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() =>
                            onChapterClick(chapter)
                        }
                        disabled={
                            !isAuthenticated ||
                            shelfStatusLoading
                        }
                    >
                        <div className='bd-chapter-info'>
                            <span className='bd-chapter-title'>
                                {chapter.display_title ??
                                    chapter.title ??
                                    `Chapter ${chapter.chapter_number}`}
                            </span>

                            <div className='bd-chapter-meta'>
                                <div className='bd-chapter-meta-left'>
                                    {chapter.word_count >
                                        0 && (
                                        <span>
                                            {chapter.word_count.toLocaleString()}{' '}
                                            words
                                        </span>
                                    )}

                                    {chapter.is_free && (
                                        <span className='bd-chapter-badge bd-chapter-badge--free'>
                                            Free
                                        </span>
                                    )}

                                    {chapter.is_new && (
                                        <span className='bd-chapter-badge bd-chapter-badge--new'>
                                            New
                                        </span>
                                    )}

                                    {chapter.is_final && (
                                        <span className='bd-chapter-badge bd-chapter-badge--final'>
                                            Final
                                        </span>
                                    )}
                                </div>

                                {chapter.published_at && (
                                    <span className='bd-chapter-published-date'>
                                        Published{' '}
                                        {formatPublishedDate(
                                            chapter.published_at
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        {!chapter.is_free &&
                            chapter.unlock_cost > 0 && (
                                <span className='bd-chapter-cost'>
                                    {chapter.unlock_cost} 🪶
                                </span>
                            )}
                    </button>
                ))}
            </div>
        </div>
    )
}