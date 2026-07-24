import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './authorLaunchModal.css'
import logo from '../../assets/images/logo.png'
import { BookOpenText } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { sendToExpo } from '../../utils/authHandoff'

export default function AuthorLaunchModal() {
    const [isVisible, setIsVisible] = useState(false)
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    useEffect(() => {
        const seen = sessionStorage.getItem('author_launch_modal_seen')
        if (!seen) setIsVisible(true)
    }, [])

    const handleClose = () => {
        sessionStorage.setItem('author_launch_modal_seen', 'true')
        setIsVisible(false)
    }

    const handleStartReading = () => {
        handleClose()
        if (isAuthenticated) {
            sendToExpo()
        } else {
            navigate('/login')
        }
    }

    const handleBrowseShelves = () => {
        handleClose()
        navigate('/library')
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

                <h2 className='launch-modal-headline' id='launch-modal-title'>Welcome, Readers.</h2>

                <div className='launch-modal-divider-row'>
                    <span className='launch-modal-divider-line' />
                    <span className='launch-modal-divider-diamond'>✦</span>
                    <span className='launch-modal-divider-line right' />
                </div>

                <p className='launch-modal-body'>
                    The shelves are open. A world of stories is waiting — come discover, unlock, and lose yourself in worlds only you can imagine.
                </p>

                <p className='launch-modal-tagline'>
                    Start exploring the shelves —<br />find the stories only you can love.
                </p>

                <div className='launch-modal-sub-divider-row'>
                    <span className='launch-modal-sub-divider-line' />
                    <BookOpenText className='launch-modal-sub-icon' />
                    <span className='launch-modal-sub-divider-line right' />
                </div>

                <button className='launch-modal-cta' onClick={handleStartReading}>
                    ✦ Start reading
                </button>
                <button className='launch-modal-dismiss' onClick={handleBrowseShelves}>
                    ⊞ Browse the shelves
                </button>
            </div>
        </div>
    )
}