import { useState } from 'react'
import AuthorRequestModal from './AuthorRequestModal'
import TermsModal from './TermsModal'
import Button from '../ui/Button'

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
                <Button
                    href='https://docs.google.com/document/d/1qZxG4koWdDWVJkMO2ZFBVrTHplwpIU1U_EpzWGAFLOk/edit?usp=sharing'
                    variant='bare'
                    className='upgrade-card-learn-more'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn more about paid authorship →
                </Button>
            </div>
            <p className='upgrade-card-description'>
                Apply to join as a paid author. Share your writing sample and genre interests — our team will review your request.
            </p>
            <Button
                variant='primary'
                onClick={() => setShowTerms(true)}
            >
                Apply to Become an Author
            </Button>

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