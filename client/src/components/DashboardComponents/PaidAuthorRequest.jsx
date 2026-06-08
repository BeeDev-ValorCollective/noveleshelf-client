import { useState } from 'react'
import AuthorRequestModal from './AuthorRequestModal'
import TermsModal from './TermsModal'

export default function PaidAuthorRequest({ accessToken, user }) {
    const [showTerms, setShowTerms] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    if (user?.paid_author_agreed_to_terms) {
        return (
            <div className='upgrade-card'>
                <div className='upgrade-card-header'>
                    <h3 className='upgrade-card-title'>Become a Paid Author</h3>
                </div>
                <p className='form-success'>Your application is under review. We'll be in touch soon.</p>
            </div>
        )
    }

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
            <button className='upgrade-card-btn' onClick={() => setShowTerms(true)}>
                Apply to Become an Author
            </button>

            {showTerms && (
                <TermsModal
                    role='paid_author'
                    onClose={() => setShowTerms(false)}
                    onAgree={() => {
                        setShowTerms(false)
                        setModalOpen(true)
                    }}
                />
            )}

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