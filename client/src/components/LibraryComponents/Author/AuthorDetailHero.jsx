// Author Fields
// fields = ['author_username', 'pen_name', 'first_name', 'last_name', 'show_real_name', 'is_publicly_visible', 'is_active', 'is_featured', 'bio', 'tier', 'contract_link', 'avatar_url', 'created_at', 'founding_author']

// Free Author Fields
// fields = ['author_username', 'pen_name', 'first_name', 'last_name', 'show_real_name', 'is_publicly_visible', 'is_active', 'is_featured', 'bio', 'avatar_url', 'created_at']

// Also, maybe:
// return { 'id', 'email', 'pen_name', 'author_username', 'first_name', 'lasst_name', 'show_real_name', 'author_type', 'founding_author' }

import { getMediaUrl } from '../../../utils/api'

export default function AuthorDetailHero({ author }) {
    const authorHandle = author.author_username || author.username;
    
    const authorTier = author.author_type === 'free' ? 'Free' : (author.tier ? `Tier ${author.tier}` : 'Author');

    return (
        <div className="ad-hero-section">

            {/* Profile Avatar Frame Container */}
            <div className="ad-avatar-frame">
                {author.avatar_url ? (
                    <img src={getMediaUrl(author.avatar_url)} alt={author.display_name} />
                ) : (
                    <div className="ad-avatar-placeholder">
                        {author.display_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                )}
            </div>
            
            {/* Profile Header Elements Block */}
            <div className="ad-profile-text">
                <div className="ad-name-row">
                    <h1>{author.display_name}</h1>
                    
                    {/* Badge displaying Author Tier (Free vs Paid Categories) */}
                    <span className={`author-tier-badge tier-${authorTier.toLowerCase().replace(' ', '-')}`}>
                        {authorTier}
                    </span>

                    {/* Founding Author Validation Flag status indicator */}
                    {author.is_founding_author && (
                        <span className="author-founding-badge">Founding Author</span>
                    )}
                </div>

                {/* Sub-header row hosting handle values */}
                <div className="ad-meta-row">
                    {authorHandle ? (
                        <p className="ad-handle">@{authorHandle}</p>
                    ) : (
                        <p className="ad-handle ad-no-handle">@no_username</p>
                    )}
                </div>

                {/* Biography Narrative Text Block — evaluates to italics notice if empty string "" */}
                {author.bio && author.bio.trim() !== "" ? (
                    <p className="ad-bio">{author.bio}</p>
                ) : (
                    <p className="ad-bio ad-empty-bio">This author has not written a biography yet.</p>
                )}
            </div>

        </div>
    )
}