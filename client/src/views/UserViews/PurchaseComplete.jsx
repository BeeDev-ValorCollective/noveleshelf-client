// views/UserViews/PurchaseComplete.jsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DB_API, ENDPOINTS } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { sendToExpo } from '../../utils/authHandoff'
import '../../components/BaseComponents/purchaseQuills.css'

const MAX_POLL_ATTEMPTS = 10
const POLL_INTERVAL_MS = 1500

export default function PurchaseComplete() {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const accessToken = useAuthStore((state) => state.accessToken)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const returnPath = searchParams.get('return_path') || ''

    // 'checking' | 'confirmed' | 'timeout'
    const [status, setStatus] = useState('checking')
    const [returning, setReturning] = useState(false)

    useEffect(() => {
        if (!sessionId) {
            setStatus('confirmed') // nothing to verify against, don't block forever
            return
        }

        let attempts = 0
        let cancelled = false

        const poll = async () => {
            try {
                const res = await fetch(
                    `${DB_API}${ENDPOINTS.checkQuillPurchaseStatus}?session_id=${sessionId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                )
                const data = await res.json()

                if (cancelled) return

                if (data.completed) {
                    setStatus('confirmed')
                    return
                }

                attempts += 1
                if (attempts >= MAX_POLL_ATTEMPTS) {
                    setStatus('timeout')
                    return
                }

                setTimeout(poll, POLL_INTERVAL_MS)
            } catch {
                if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS)
            }
        }

        poll()
        return () => { cancelled = true }
    }, [sessionId, accessToken])

    const handleReturn = () => {
        setReturning(true)
        sendToExpo(returnPath)
    }

    return (
        <div className='purchase-quills-container'>
            <h2 className='purchase-quills-title'>
                {status === 'confirmed' ? 'Purchase Successful!' : 'Confirming Your Purchase...'}
            </h2>

            <p className='purchase-quills-subtitle'>
                {status === 'checking' && 'Just a moment while we confirm your payment.'}
                {status === 'confirmed' && 'Your Quills have been added to your wallet.'}
                {status === 'timeout' && "This is taking longer than expected, but don't worry — your Quills will show up shortly."}
            </p>

            {isAuthenticated ? (
                <button
                    className='quill-bundle-btn'
                    style={{ maxWidth: '300px' }}
                    onClick={handleReturn}
                    disabled={status === 'checking' || returning}
                >
                    {returning ? 'Returning to app...' : 'Return to App'}
                </button>
            ) : (
                status !== 'checking' && (
                    <p className='purchase-quills-subtitle'>
                        You can close this tab and return to the app.
                    </p>
                )
            )}
        </div>
    )
}