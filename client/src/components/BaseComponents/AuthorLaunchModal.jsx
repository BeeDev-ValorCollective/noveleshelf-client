import { useState, useEffect } from 'react'
import './authorLaunchModal.css'
import logo from '../../assets/images/logo.png'

export default function AuthorLaunchModal() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const seen = sessionStorage.getItem('author_launch_modal_seen')
        if (!seen) setIsVisible(true)
    }, [])

    const handleClose = () => {
        sessionStorage.setItem('author_launch_modal_seen', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className='launch-overlay'>
            <div className='launch-modal' role='dialog' aria-modal='true' aria-labelledby='launch-modal-title'>
                <button className='launch-modal-close' aria-label='Close' onClick={handleClose}>
                    ✕
                </button>

                <img src={logo} alt='Novel eShelf' className='launch-modal-logo' />

                <div className='launch-modal-eyebrow-row'>
                    <span className='launch-modal-eyebrow-line' />
                    <p className='launch-modal-eyebrow'>Novel eShelf is live</p>
                    <span className='launch-modal-eyebrow-line right' />
                </div>

                <h2 className='launch-modal-headline' id='launch-modal-title'>Welcome, authors.</h2>

                <div className='launch-modal-divider-row'>
                    <span className='launch-modal-divider-line' />
                    <span className='launch-modal-divider-diamond'>✦</span>
                    <span className='launch-modal-divider-line right' />
                </div>

                <p className='launch-modal-body'>
                    The shelves are open. Your stories now have a home — a place where readers
                    discover, unlock, and lose themselves in the worlds you create.
                </p>

                <p className='launch-modal-tagline'>
                    Start filling the shelves with<br />the stories only you can tell.
                </p>

                <div className='launch-modal-sub-divider-row'>
                    <span className='launch-modal-sub-divider-line' />
                    <span className='launch-modal-sub-icon'>📖</span>
                    <span className='launch-modal-sub-divider-line right' />
                </div>

                <p className='launch-modal-sub-note'>Readers are waiting for their next adventure.</p>

                <button className='launch-modal-cta' onClick={handleClose}>
                    ✦ Start writing
                </button>
                <button className='launch-modal-dismiss' onClick={handleClose}>
                    ⊞ Explore first
                </button>
            </div>
        </div>
    )
}