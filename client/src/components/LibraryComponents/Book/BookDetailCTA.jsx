import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../../store/authStore'
import { sendToExpo } from '../../../utils/authHandoff'
import { BookmarkPlus } from 'lucide-react'

export default function BookDetailCTA({ title }) {
    const navigate = useNavigate()
    const location = useLocation()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const handleGoToApp = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location.pathname } })
            return
        }
        sendToExpo(`(protected)/(reader-tabs)/dashboard`)
    }
    return (
        <div className='bd-cta'>
            <p className='bd-cta-text'>
                Love what you see? The Novel eShelf web app is now live — <em>{title}</em> is waiting for you.
            </p>
            <p>
                <button className='bd-shelf-btn' onClick={handleGoToApp}>
                    <BookmarkPlus size={18} />
                    {isAuthenticated ? 'Go to the Web App' : 'Sign in'}
                </button>
            </p>
        </div>
    )
}