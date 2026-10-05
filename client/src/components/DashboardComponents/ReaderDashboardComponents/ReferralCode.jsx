import { useState } from 'react'

import useAuthStore from '../../../store/authStore'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import Button from '../../ui/Button'
import './readerDashboard.css'

export default function ReferralCode() {
    const referralCode = useAuthStore((state) => state.user?.referral_code?.code)
    const hasRedeemed = useAuthStore((state) => state.user?.has_redeemed_referral)
    const accessToken = useAuthStore((state) => state.accessToken)
    const updateUser = useAuthStore((state) => state.updateUser)

    const [copied, setCopied] = useState(false)
    const [enteredCode, setEnteredCode] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [message, setMessage] = useState('')

    const handleCopy = async () => {
        if (!referralCode) return
        try {
            await navigator.clipboard.writeText(referralCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            setCopied(false)
        }
    }

    const handleRedeem = async (e) => {
        e.preventDefault()

        const trimmed = enteredCode.trim()
        if (!trimmed) return

        setStatus('loading')
        setMessage('')

        try {
            const response = await fetch(`${DB_API}${ENDPOINTS.redeemReferralCode}`, {
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
                setMessage(data.error || "That code didn't work.")
                return
            }

            setStatus('success')
            setMessage(
                data.rewarded_immediately
                    ? "You're in! Black Ink has been added to your wallet."
                    : "Code saved! You'll both get Black Ink once your email is verified."
            )
            setEnteredCode('')

            // Refresh /me/ so balance + redeemed flag update
            const meRes = await fetch(`${DB_API}${ENDPOINTS.me}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            if (meRes.ok) {
                const freshUser = await meRes.json()
                updateUser(freshUser)
            }
        } catch (err) {
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="wallet-referral">
            <div className="wallet-purchase">
                <h3>Redeem Rewards with Referral Codes</h3>
            </div>
            <div className="referral-code-card">
                <h5>Share your referral code with friends to receive bonus ink drops and rewards.</h5>
                <div className="referral-form-components">
                    <label htmlFor="own-referral-code" className="redeem-promo-label">
                        Your Referral Code
                    </label>
                    <input
                        id="own-referral-code"
                        type="text"
                        value={referralCode || '—'}
                        readOnly
                        onFocus={(e) => e.target.select()}
                        className="redeem-promo-input referral-code-input"
                    />
                    <Button type="button" variant="ghost" size="lg" onClick={handleCopy} disabled={!referralCode}>
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </div>

            {!hasRedeemed && status !== 'success' ? (
                <form onSubmit={handleRedeem} className="redeem-promo-form">
                    <h5>Claim rewards by entering a referral code below.</h5>
                    <div className="referral-form-components">
                        <label htmlFor="referral-code" className="redeem-promo-label">
                            Have a Friend's Code?
                        </label>
                        <input
                            id="referral-code"
                            type="text"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
                            placeholder="Enter referral code"
                            disabled={status === 'loading'}
                            className="redeem-promo-input"
                        />
                        <Button
                            type="submit"
                            disabled={status === 'loading' || !enteredCode.trim()}
                            variant="ghost"
                            size="lg"
                        >
                            {status === 'loading' ? '...' : 'Redeem'}
                        </Button>
                    </div>
                </form>
            ) : null}

            {message ? (
                <p className={status === 'error' ? 'redeem-promo-error' : 'redeem-promo-success'}>
                    {message}
                </p>
            ) : null}
        </div>
    )
}