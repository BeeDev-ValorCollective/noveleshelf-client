import { useState } from "react"

const FREE_AUTHOR_AGREEMENT_VIEW_URL = "https://docs.google.com/document/d/153aPeE6QDBH_8gUWRinpC4RQNuYCSldw/edit?usp=sharing&ouid=100577313488847648002&rtpof=true&sd=true/view"
const FREE_AUTHOR_AGREEMENT_PREVIEW_URL = "https://docs.google.com/document/d/153aPeE6QDBH_8gUWRinpC4RQNuYCSldw/edit?usp=sharing&ouid=100577313488847648002&rtpof=true&sd=true/preview"

const TERMS = {
    free_author: {
        title: 'Free Author Terms',
        intro: 'By upgrading to Free Author you confirm that:',
        items: [
            'You are the sole owner of any work you publish',
            'Your work does not infringe on any copyright or trademark',
            'Your work does not contain sexual content involving minors',
            'Your content matches the rating you select — when in doubt, rate higher or contact admin',
            'You will not publish defamatory, harassing, or illegal content',
            'Novel eShelf may remove content that violates these terms at any time',
        ]
    },
    paid_author: {
        title: 'Paid Author Terms',
        intro: 'By applying to become a Paid Author you confirm that:',
        items: [
            'You are the sole owner and copyright holder of any work you submit',
            'Your work does not infringe on any copyright or trademark',
            'Your work does not contain sexual content involving minors',
            'Your content matches the rating you select — when in doubt, rate higher or contact admin',
            'You will not publish defamatory, harassing, or illegal content',
            'Novel eShelf may remove content that violates these terms at any time',
            'A full publishing agreement will be provided separately before your first work goes live',
        ]
    },
    moderator: {
        title: 'Moderator Terms',
        intro: 'By accepting the Moderator role you confirm that:',
        items: [
            'You will handle all user content and reports with fairness and impartiality',
            'You will keep all platform content and user information confidential',
            'You will not abuse your moderation privileges',
            'You will follow Novel eShelf\'s content and community guidelines',
            'Your moderator access may be revoked at any time for violations of these terms',
        ]
    },
    admin: {
        title: 'Admin Terms',
        intro: 'By accepting the Admin role you confirm that:',
        items: [
            'You will handle all platform data and user information with strict confidentiality',
            'You will not abuse your administrative privileges',
            'You will act in the best interest of the platform and its users',
            'Your admin access may be revoked at any time for violations of these terms',
            'You understand that your actions as admin are logged and auditable',
        ]
    }
}

export default function TermsModal({ role, onAgree, onClose, hasPaidAuthor }) {
    const [checked, setChecked] = useState(false)
    const [hasScrolledAgreement, setHasScrolledAgreement] = useState(false)
    const terms = TERMS[role]
    if (!terms) return null

    const requiresAgreementScroll = role === 'free_author'

    const handleAgreementScroll = (e) => {
        const el = e.currentTarget
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8

        if (atBottom) {
            setHasScrolledAgreement(true)
        }
    }

    const canCheckTerms = !requiresAgreementScroll || hasScrolledAgreement

    return (
        <div className='modal-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className='modal-box'>
                <div className='modal-box-header'>
                    <h2 className='modal-box-title'>{terms.title}</h2>
                    <button className='modal-box-close' onClick={onClose}>✕</button>
                </div>

                {role === 'free_author' && hasPaidAuthor && (
                    <p className='form-warning'>
                        ⚠️ You already have a paid author profile. Adding a free author profile means two separate author identities.
                    </p>
                )}

                <p className='section-note'>{terms.intro}</p>

                <ul className='terms-list'>
                    {terms.items.map((item, i) => (
                        <li key={i} className='terms-item'>{item}</li>
                    ))}
                </ul>

                {role === 'free_author' && (
                <>
                    <p className='section-note'>
                        Please review the full Free Author Publishing Agreement before continuing.
                    </p>
                    <a
                        href={FREE_AUTHOR_AGREEMENT_VIEW_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open the agreement in a new tab
                    </a>

                    <div
                        className='agreement-scroll-box'
                        onScroll={handleAgreementScroll}
                    >
                        <iframe
                            src="/agreement/free-author"
                            title="Free Author Publishing Agreement"
                            className="agreement-frame"
                        />
                    </div>

                    {!hasScrolledAgreement && (
                        <p className='section-note'>
                            Scroll to the bottom of the agreement to enable the checkbox.
                        </p>
                    )}
                </>
            )}

                <div className='bff-field bff-field--toggle'>
                    <label className='bff-label bff-label--toggle' htmlFor='terms-checkbox'>
                        <input
                            id='terms-checkbox'
                            type='checkbox'
                            checked={checked}
                            disabled={!canCheckTerms}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        I have read and agree to the above terms
                    </label>
                </div>

                <div className='terms-actions'>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onAgree} disabled={!checked}>
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    )
}