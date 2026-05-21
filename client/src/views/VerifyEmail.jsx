import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { DB_API, ENDPOINTS } from '../utils/api'


export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying')
    const [message, setMessage] = useState('')
    const user = useAuthStore((state) => state.user)
    const updateUser = useAuthStore((state) => state.updateUser)
    const hasVerified = useRef(false)

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('No verification token found. Please check your email link.')
            return
        }

        // prevent double call in strict mode
        if (hasVerified.current) return
        hasVerified.current = true

        const verify = async () => {
            try {
                const response = await fetch(`${DB_API}${ENDPOINTS.verifyEmail(token)}`)
                const data = await response.json()

                if (response.ok) {
                    setStatus('success')
                    setMessage(data.message)
                    if (user) {
                        updateUser({ ...user, is_verified: true })
                    }
                } else {
                    setStatus('error')
                    setMessage(data.error || 'Verification failed. Please try again.')
                }
            } catch (err) {
                console.error('Verification error:', err)
                setStatus('error')
                setMessage('Something went wrong. Please try again.')
            }
        }

        verify()
    }, [])

    return (
        <div className="verify-email">
            {status === 'verifying' && (
                <p>Verifying your email...</p>
            )}
            {status === 'success' && (
                <>
                    <h1>Email Verified!</h1>
                    <p>{message}</p>
                    <a href="/dashboard">Go to Dashboard</a>
                </>
            )}
            {status === 'error' && (
                <>
                    <h1>Verification Failed</h1>
                    <p>{message}</p>
                    <a href="/dashboard">Go to Dashboard</a>
                </>
            )}
        </div>
    )
}