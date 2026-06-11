export default function BookDetailChapters({ chapters }) {
    if (!chapters?.length) return null

    return (
        <div className='bd-section'>
            <h2 className='bd-section-title'>Chapters</h2>
            <div className='bd-chapter-list'>
                {chapters.map(chapter => (
                    <div key={chapter.id} className='bd-chapter-item'>
                        <div className='bd-chapter-info'>
                            <span className='bd-chapter-title'>{chapter.display_title}</span>
                            <div className='bd-chapter-meta'>
                                {chapter.word_count > 0 && (
                                    <span>{chapter.word_count.toLocaleString()} words</span>
                                )}
                                {chapter.is_free && (
                                    <span className='bd-chapter-badge bd-chapter-badge--free'>Free</span>
                                )}
                                {chapter.is_new && (
                                    <span className='bd-chapter-badge bd-chapter-badge--new'>New</span>
                                )}
                                {chapter.is_final && (
                                    <span className='bd-chapter-badge bd-chapter-badge--final'>Final</span>
                                )}
                            </div>
                        </div>
                        {!chapter.is_free && chapter.unlock_cost > 0 && (
                            <span className='bd-chapter-cost'>{chapter.unlock_cost} 🪶</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}