import { getMediaUrl } from '../../../utils/api'

export default function BookDetailHero({ book }) {
    const { author } = book

    return (
        <div className='bd-hero'>
            <div className='bd-cover-wrap'>
                <img
                    src={getMediaUrl(book.cover_image)}
                    alt={book.title}
                    className='bd-cover'
                />
                {book.is_complete && (
                    <span className='bd-badge bd-badge--complete'>✓ Complete</span>
                )}
                {book.is_new && (
                    <span className='bd-badge bd-badge--new'>New</span>
                )}
            </div>

            <div className='bd-hero-info'>
                <h1 className='bd-title'>{book.title}</h1>

                {author && (
                    <p className='bd-author'>by {author.display_name}</p>
                )}

                <div className='bd-meta-row'>
                    {book.content_rating && (
                        <span className='bd-rating-badge'>
                            {book.content_rating.code} — {book.content_rating.name}
                        </span>
                    )}
                    {book.book_tier && (
                        <span className='bd-tier-badge'>Tier {book.book_tier}</span>
                    )}
                </div>

                {book.genres?.length > 0 && (
                    <div className='bd-tags'>
                        {book.genres.map(g => (
                            <span key={g.id} className='bd-tag'>{g.name}</span>
                        ))}
                    </div>
                )}

                {book.relationship_tags?.length > 0 && (
                    <div className='bd-tags'>
                        {book.relationship_tags.map(t => (
                            <span key={t.id} className='bd-tag bd-tag--rel'>{t.name}</span>
                        ))}
                    </div>
                )}

                {book.keywords?.length > 0 && (
                    <div className='bd-tags'>
                        {book.keywords.map(k => (
                            <span key={k.id} className='bd-tag bd-tag--keyword'>{k.name}</span>
                        ))}
                    </div>
                )}

                <div className='bd-stats'>
                    <span>
                        {book.published_chapter_count} chapter{book.published_chapter_count !== 1 ? 's' : ''}
                    </span>
                    {book.published_chapter_count > 0 && book.free_chapters > 0 && (
                        <span>{Math.min(book.free_chapters, book.published_chapter_count)} free</span>
                    )}
                </div>
            </div>
        </div>
    )
}