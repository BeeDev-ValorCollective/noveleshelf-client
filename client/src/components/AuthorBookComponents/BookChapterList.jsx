export default function BookChapterList({ chapters, isLoading, error, bookId, book, navigate }) {
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

    return (
        <div className='chapter-list'>
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
                            <button onClick={() => navigate(
                                `/author/books/${bookId}/chapters/${chapter.id}/edit`,
                                { state: { chapter, book } }
                            )}>
                                Edit
                            </button>
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