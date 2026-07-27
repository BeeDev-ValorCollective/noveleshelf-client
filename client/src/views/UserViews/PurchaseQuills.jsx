import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DB_API, ENDPOINTS } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import '../../components/BaseComponents/purchaseQuills.css'

export default function PurchaseQuills() {
    const accessToken = useAuthStore((state) => state.accessToken)

    const [bundles, setBundles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [purchasingId, setPurchasingId] = useState(null)
    const [searchParams] = useSearchParams()
    const returnPath = searchParams.get('return') || ''

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const res = await fetch(`${DB_API}${ENDPOINTS.listQuillBundles}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                const data = await res.json()
                if (res.ok) {
                    setBundles(data)
                } else {
                    setError('Could not load Quill bundles.')
                }
            } catch {
                setError('Unable to connect. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBundles()
    }, [accessToken])

    const handlePurchase = async (bundleId) => {
        setPurchasingId(bundleId)
        setError(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.createQuillCheckout}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bundle_id: bundleId, return_path: returnPath }),
            })
            const data = await res.json()
            if (res.ok) {
                window.location.href = data.checkout_url
            } else {
                setError(data.error || 'Could not start checkout.')
                setPurchasingId(null)
            }
        } catch {
            setError('Unable to connect. Please try again.')
            setPurchasingId(null)
        }
    }

    if (isLoading) return <p>Loading...</p>

    return (
        <div className='purchase-quills-container'>
            <h2 className='purchase-quills-title'>Get More Quills</h2>
            <p className='purchase-quills-subtitle'>
                Choose a bundle to unlock more chapters and support the authors you love.
            </p>

            {error && <p className='form-error'>{error}</p>}

            <div className='quill-bundle-grid'>
                {bundles.map((bundle) => (
                    <div key={bundle.id} className='quill-bundle-card'>
                        {bundle.bonus_percent && (
                            <span className='quill-bundle-badge'>+{bundle.bonus_percent}% Bonus</span>
                        )}
                        <h3 className='quill-bundle-name'>{bundle.name}</h3>
                        <p className='quill-bundle-quills'>{bundle.quills.toLocaleString()} Quills</p>
                        <p className='quill-bundle-price'>${(bundle.price_cents / 100).toFixed(2)}</p>
                        <button
                            className='quill-bundle-btn'
                            onClick={() => handlePurchase(bundle.id)}
                            disabled={purchasingId === bundle.id}
                        >
                            {purchasingId === bundle.id ? 'Redirecting...' : 'Purchase'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}