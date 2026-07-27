import Button from '../ui/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { sendToExpo } from '../../utils/authHandoff'
import './forReaders.css'

export default function CTA() {
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
        <>
        <section className='readers-cta'>
            <h2>Start Your Reading Journey Today</h2>
            <p>Join thousands of readers discovering their next favorite book</p>
            <Button variant='primary' size='lg' className='cta-button' onClick={handleGoToApp}>
                {isAuthenticated ? 'Go to the Web App' : 'Sign in'}
            </Button>
        </section>
        </>
    )
}