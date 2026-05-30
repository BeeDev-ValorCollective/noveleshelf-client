import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import { Mail } from 'lucide-react'

export default function VerificationBanner() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const accessToken = useAuthStore((state) => state.accessToken)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState(null)

    if (!isAuthenticated || !user || user.is_verified) return null

    const handleResend = async () => {
        setSending(true)
        setError(null)
        try {
            const response = await fetch(`${DB_API}${ENDPOINTS.resendVerification}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (response.ok) {
                setSent(true)
            } else {
                setError('Failed to resend. Please try again.')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setSending(false)
        }
    }

    if (sent) {
        return (
            <div className="verification-banner">
                <div className="verification-banner-left">
                    <Mail className="verification-banner-icon" />
                    <p>Verification email sent! Please check your inbox.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="verification-banner">
            <div className="verification-banner-left">
                <Mail className="verification-banner-icon" />
                <p>Please check your inbox and verify your email to unlock all features.</p>
            </div>
            <div className="verification-banner-right">
                {error && <p className="banner-error">{error}</p>}
                <button
                    onClick={handleResend}
                    disabled={sending}
                    className="resend-btn"
                >
                    {sending ? 'Sending...' : 'Resend Verification Email'}
                </button>
            </div>
        </div>
    )
}