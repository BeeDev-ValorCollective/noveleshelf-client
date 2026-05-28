import { useState } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'
import TermsModal from './TermsModal'

export default function FreeAuthorUpgrade({ accessToken, hasPaidAuthor, onUpgradeSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [showTerms, setShowTerms] = useState(false)

    const handleUpgrade = async () => {
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
                onClick={() => setShowTerms(true)}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Upgrading...' : 'Become a Free Author'}
            </button>

            {showTerms && (
                <TermsModal
                    role='free_author'
                    hasPaidAuthor={hasPaidAuthor}
                    onClose={() => setShowTerms(false)}
                    onAgree={() => {
                        setShowTerms(false)
                        handleUpgrade()
                    }}
                />
            )}
        </div>
    )
}