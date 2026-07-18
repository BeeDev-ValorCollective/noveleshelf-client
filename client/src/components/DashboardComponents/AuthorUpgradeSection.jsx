import useAuthStore from '../../store/authStore'
import FreeAuthorUpgrade from './FreeAuthorUpgrade'
import PaidAuthorRequest from './PaidAuthorRequest'

export default function AuthorUpgradeSection({ onLoginClick }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const accessToken = useAuthStore((state) => state.accessToken)

    const hasPaidAuthor = !!user?.author_profile
    const hasFreeAuthor = !!user?.free_author_profile

    // Logged in and already has both profiles — nothing left to show
    if (isAuthenticated && hasPaidAuthor && hasFreeAuthor) return null

    return (
        <div className='author-upgrade-section'>
            
            {/* FREE AUTHOR UPGRADE CARD */}
            {(!isAuthenticated || !hasFreeAuthor) && (
                isAuthenticated ? (
                    <FreeAuthorUpgrade
                        accessToken={accessToken}
                        hasPaidAuthor={hasPaidAuthor}
                        onUpgradeSuccess={() => window.location.reload()}
                    />
                ) : (
                    <div className='upgrade-card'>
                        <div className='upgrade-card-header'>
                            <h3 className='upgrade-card-title'>Share Your Stories for Free</h3>
                            <a href='https://docs.google.com/document/d/1qZxG4koWdDWVJkMO2ZFBVrTHplwpIU1U_EpzWGAFLOk/edit?usp=sharing' className='upgrade-card-learn-more' target="_blank" rel="noopener noreferrer">
                                Learn more about free authorship →
                            </a>
                        </div>
                        <p className='upgrade-card-description'>
                            No approval needed — upgrade instantly and start publishing. Your books will always be free to read.
                        </p>
                        <button className='upgrade-card-btn' onClick={onLoginClick}>
                            Sign In to Get Started
                        </button>
                    </div>
                )
            )}

            {/* PAID AUTHOR REQUEST CARD */}
            {(!isAuthenticated || !hasPaidAuthor) && (
                isAuthenticated ? (
                    <PaidAuthorRequest 
                        accessToken={accessToken} 
                        user={user} 
                    />
                ) : (
                    <div className='upgrade-card'>
                        <div className='upgrade-card-header'>
                            <h3 className='upgrade-card-title'>Become a Paid Author</h3>
                            <a href='https://docs.google.com/document/d/1qZxG4koWdDWVJkMO2ZFBVrTHplwpIU1U_EpzWGAFLOk/edit?usp=sharing' className='upgrade-card-learn-more' target="_blank" rel="noopener noreferrer">
                                Learn more about paid authorship →
                            </a>
                        </div>
                        <p className='upgrade-card-description'>
                            Apply to join as a paid author. Share your writing sample and genre interests — our team will review your request.
                        </p>
                        <button className='upgrade-card-btn' onClick={onLoginClick}>
                            Sign In to Apply
                        </button>
                    </div>
                )
            )}

        </div>
    )
}