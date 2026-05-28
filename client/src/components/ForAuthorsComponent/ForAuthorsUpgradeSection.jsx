import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import AuthorRequestModal from '../DashboardComponents/AuthorRequestModal'

export default function ForAuthorsUpgradeSection({ onLoginClick }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const accessToken = useAuthStore((state) => state.accessToken)

    const hasPaidAuthor = !!user?.author_profile
    const hasFreeAuthor = !!user?.free_author_profile

    // logged in and has both — nothing to show
    if (isAuthenticated && hasPaidAuthor && hasFreeAuthor) return null

    return (
        <section className='for-authors-upgrade-section'>
            <h2 className='for-authors-upgrade-title'>Ready to start writing?</h2>
            <p className='for-authors-upgrade-subtitle'>
                Choose the path that's right for you.
            </p>
            <div className='author-upgrade-section'>
                {(!isAuthenticated || !hasFreeAuthor) && (
                    <ForAuthorsUpgradeCard
                        title='Share Your Stories for Free'
                        learnMoreHref='#free-author'
                        learnMoreLabel='Learn more about free authorship'
                        description='No approval needed — upgrade instantly and start publishing. Your books will always be free to read.'
                        btnLabel='Become a Free Author'
                        isAuthenticated={isAuthenticated}
                        onLoginClick={onLoginClick}
                        onAuthenticatedClick={async () => {
                            const message = hasPaidAuthor
                                ? 'You already have a paid author profile. Adding a free author profile means two separate author identities. Are you sure?'
                                : 'As a free author your books will always be free to read. Are you sure?'
                            if (!window.confirm(message)) return
                            const res = await fetch(`${DB_API}${ENDPOINTS.freeAuthorUpgrade}`, {
                                method: 'POST',
                                headers: { Authorization: `Bearer ${accessToken}` }
                            })
                            const data = await res.json()
                            if (res.ok) window.location.reload()
                            else alert(data.error || 'Could not complete upgrade.')
                        }}
                    />
                )}
                {(!isAuthenticated || !hasPaidAuthor) && (
                    <ForAuthorsPaidCard
                        isAuthenticated={isAuthenticated}
                        onLoginClick={onLoginClick}
                        accessToken={accessToken}
                    />
                )}
            </div>
        </section>
    )
}

function ForAuthorsUpgradeCard({ title, learnMoreHref, learnMoreLabel, description, btnLabel, isAuthenticated, onLoginClick, onAuthenticatedClick }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClick = async () => {
        if (!isAuthenticated) {
            onLoginClick()
            return
        }
        setIsSubmitting(true)
        await onAuthenticatedClick()
        setIsSubmitting(false)
    }

    return (
        <div className='upgrade-card'>
            <div className='upgrade-card-header'>
                <h3 className='upgrade-card-title'>{title}</h3>
                <a href={learnMoreHref} className='upgrade-card-learn-more'>{learnMoreLabel} →</a>
            </div>
            <p className='upgrade-card-description'>{description}</p>
            <button className='upgrade-card-btn' onClick={handleClick} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : isAuthenticated ? btnLabel : 'Sign in to get started'}
            </button>
        </div>
    )
}

function ForAuthorsPaidCard({ isAuthenticated, onLoginClick, accessToken }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    if (submitted) {
        return (
            <div className='upgrade-card'>
                <p className='form-success'>Your author request has been submitted. We'll be in touch soon.</p>
            </div>
        )
    }

    return (
        <div className='upgrade-card'>
            <div className='upgrade-card-header'>
                <h3 className='upgrade-card-title'>Become a Paid Author</h3>
                <a href='#paid-author' className='upgrade-card-learn-more'>Learn more about paid authorship →</a>
            </div>
            <p className='upgrade-card-description'>
                Apply to join as a paid author. Share your writing sample and genre interests — our team will review your request.
            </p>
            <button
                className='upgrade-card-btn'
                onClick={() => isAuthenticated ? setModalOpen(true) : onLoginClick()}
            >
                {isAuthenticated ? 'Apply to Become an Author' : 'Sign in to apply'}
            </button>
            {modalOpen && (
                <AuthorRequestModal
                    accessToken={accessToken}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false)
                        setSubmitted(true)
                    }}
                />
            )}
        </div>
    )
}