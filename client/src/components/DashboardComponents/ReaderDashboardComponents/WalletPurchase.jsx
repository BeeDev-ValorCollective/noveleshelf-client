import { useState } from 'react'
import { Link } from 'react-router-dom'

import useAuthStore from '../../../store/authStore'
import { DB_API, ENDPOINTS } from '../../../utils/api'

export default function WalletPurchase() {
    const [code, setCode] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [message, setMessage] = useState('')

    const accessToken = useAuthStore((state) => state.accessToken)
    const updateUser = useAuthStore((state) => state.updateUser)

    const handleRedeem = async (e) => {
        e.preventDefault()

        const trimmed = code.trim()
        if (!trimmed) return

        setStatus('loading')
        setMessage('')

        try {
            const response = await fetch(`${DB_API}${ENDPOINTS.redeemPromoCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ code: trimmed }),
            })

            const data = await response.json()

            if (!response.ok) {
                setStatus('error')
                // Backend already returns a human-readable message, e.g.
                // "Invalid code.", "This code has expired.", "You've already redeemed this code."
                setMessage(data.error || 'That code didn\'t work.')
                return
            }

            // Refresh /me/ so wallet balance shown elsewhere updates immediately
            const meRes = await fetch(`${DB_API}${ENDPOINTS.me}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (meRes.ok) {
                const freshUser = await meRes.json()
                updateUser(freshUser)
            }

            setStatus('success')
            setMessage(`+${data.amount} ${formatCurrencyLabel(data.currency_type)} added to your wallet!`)
            setCode('')
        } catch (err) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="wallet-purchase">
            <div className="wallet-purchase-quills">
                <button>
                    <Link to="/purchase-quills">Purchase Quills</Link>
                </button>
            </div>
            <div className="wallet-purchase-promo">
                <form onSubmit={handleRedeem} className="redeem-promo-form">
                    <label htmlFor="promo-code" className="redeem-promo-label">
                        Promo Code
                    </label>
                    <div className="redeem-promo-row">
                        <input
                            id="promo-code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            disabled={status === 'loading'}
                            className="redeem-promo-input"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading' || !code.trim()}
                            className="redeem-promo-btn"
                        >
                            {status === 'loading' ? '...' : 'Redeem'}
                        </button>
                    </div>
                    {message ? (
                        <p className={status === 'error' ? 'redeem-promo-error' : 'redeem-promo-success'}>
                            {message}
                        </p>
                    ) : null}
                </form>
            </div>
        </div>
    )
}

function formatCurrencyLabel(currencyType) {
    const map = {
        black_ink: 'Black Ink',
        gold_ink: 'Gold Ink',
        quills: 'Quills',
    }
    return map[currencyType] || currencyType
}