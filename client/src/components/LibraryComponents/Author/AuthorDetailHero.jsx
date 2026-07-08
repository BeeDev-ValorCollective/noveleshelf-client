import { getMediaUrl } from '../../../utils/api'

export default function AuthorDetailHero({ author }) {
    return (
        <div className="ad-hero-section">
            <div className="ad-avatar-frame">
                {author.avatar_url ? (
                    <img src={getMediaUrl(author.avatar_url)} alt={author.display_name} />
                ) : (
                    <div className="ad-avatar-placeholder">{author.display_name?.[0] ?? '?'}</div>
                )}
            </div>
            
            <div className="ad-profile-text">
                <div className="ad-name-row">
                    <h1>{author.display_name}</h1>
                    {author.is_founding_author && (
                        <span className="author-founding-badge">Founding Author</span>
                    )}
                </div>
                {author.username && <p className="ad-handle">@{author.username}</p>}
                {author.bio && <p className="ad-bio">{author.bio}</p>}
            </div>
        </div>
    )
}