import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import AuthorRequestModal from './AuthorRequestModal'

export default function AuthorUpgradeSection({ user, currentRole, onUpgradeSuccess }) {
    const accessToken = useAuthStore((state) => state.accessToken)

    const hasPaidAuthor = !!user?.author_profile
    const hasFreeAuthor = !!user?.free_author_profile

    if (hasPaidAuthor && hasFreeAuthor) return null

    return (
        <div className='author-upgrade-section'>
            {!hasFreeAuthor && (
                <FreeAuthorUpgrade
                    accessToken={accessToken}
                    hasPaidAuthor={hasPaidAuthor}
                    onUpgradeSuccess={onUpgradeSuccess}
                />
            )}
            {!hasPaidAuthor && (
                <PaidAuthorRequest accessToken={accessToken} />
            )}
        </div>
    )
}

function FreeAuthorUpgrade({ accessToken, hasPaidAuthor, onUpgradeSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleUpgrade = async () => {
        const message = hasPaidAuthor
            ? 'You already have a paid author profile. Adding a free author profile means two separate author identities. Are you sure?'
            : 'As a free author your books will always be free to read. Are you sure?'

        if (!window.confirm(message)) return

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.upgradeToFreeAuthor}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` }
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess(data.message)
                if (onUpgradeSuccess) onUpgradeSuccess()
            } else {
                setError(data.error || 'Could not complete upgrade.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) return <p className='form-success'>{success}</p>

    return (
        <div className='upgrade-card'>
            <div className='upgrade-card-header'>
                <h3 className='upgrade-card-title'>Share Your Stories for Free</h3>
                <a href='/for-authors#free-author' className='upgrade-card-learn-more'>
                    Learn more about free authorship →
                </a>
            </div>
            <p className='upgrade-card-description'>
                No approval needed — upgrade instantly and start publishing. Your books will always be free to read.
            </p>
            {error && <p className='form-error'>{error}</p>}
            <button
                className='upgrade-card-btn'
                onClick={handleUpgrade}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Upgrading...' : 'Become a Free Author'}
            </button>
        </div>
    )
}

function PaidAuthorRequest({ accessToken }) {
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
                <a href='/for-authors#paid-author' className='upgrade-card-learn-more'>
                    Learn more about paid authorship →
                </a>
            </div>
            <p className='upgrade-card-description'>
                Apply to join as a paid author. Share your writing sample and genre interests — our team will review your request.
            </p>
            <button className='upgrade-card-btn' onClick={() => setModalOpen(true)}>
                Apply to Become an Author
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