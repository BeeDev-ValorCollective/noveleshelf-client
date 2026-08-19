import { useState } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'
import TermsModal from './TermsModal'
import Button from '../ui/Button'

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
                <Button
                    href='https://docs.google.com/document/d/1qZxG4koWdDWVJkMO2ZFBVrTHplwpIU1U_EpzWGAFLOk/edit?usp=sharing'
                    variant='bare'
                    className='upgrade-card-learn-more'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn more about free authorship →
                </Button>
            </div>
            <p className='upgrade-card-description'>
                No approval needed — upgrade instantly and start publishing. Your books will always be free to read.
            </p>
            {error && <p className='form-error'>{error}</p>}
            <Button
                variant='primary'
                onClick={() => setShowTerms(true)}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Upgrading...' : 'Become a Free Author'}
            </Button>

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