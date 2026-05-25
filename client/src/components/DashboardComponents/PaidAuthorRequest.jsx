import { useState } from 'react'
import AuthorRequestModal from './AuthorRequestModal'

export default function PaidAuthorRequest({ accessToken }) {
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