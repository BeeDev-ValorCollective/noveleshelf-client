import { useState, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import { DB_API, ENDPOINTS } from '../../utils/api'
import { Mail } from 'lucide-react'

export default function VerificationBanner() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const accessToken = useAuthStore((state) => state.accessToken)
    const updateUser = useAuthStore((state) => state.updateUser)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isAuthenticated || !user || user.is_verified) return

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${DB_API}${ENDPOINTS.me}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    if (data.is_verified) {
                        updateUser({ ...user, ...data })
                        clearInterval(interval)
                    }
                }
            } catch {
                // silent fail
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [isAuthenticated, user, accessToken])

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
        } catch {
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
            {sent ? (
                <p>✉️ Verification email sent! Please check your inbox.</p>
            ) : (
                <>
                    <p>
                        Please verify your email to unlock all features. 
                        Check your inbox or{' '}
                        <button 
                            onClick={handleResend} 
                            disabled={sending}
                            className="resend-btn"
                        >
                            {sending ? 'Sending...' : 'resend the verification email'}
                        </button>
                    </p>
                    {error && <p className="banner-error">{error}</p>}
                </>
            )}
        </div>
    )
}