// views/UserViews/PurchaseComplete.jsx
import { useEffect, useState } from 'react'
import useAuthStore from '../../store/authStore'
import { sendToExpo } from '../../utils/authHandoff'
import '../../components/BaseComponents/purchaseQuills.css'

export default function PurchaseComplete() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const [returning, setReturning] = useState(false)

    const handleReturn = () => {
        setReturning(true)
        sendToExpo()
    }

    return (
        <div className='purchase-quills-container'>
            <h2 className='purchase-quills-title'>Purchase Successful!</h2>
            <p className='purchase-quills-subtitle'>
                Your Quills are on their way to your wallet. It may take a moment to show up.
            </p>

            {isAuthenticated ? (
                <button
                    className='quill-bundle-btn'
                    style={{ maxWidth: '300px' }}
                    onClick={handleReturn}
                    disabled={returning}
                >
                    {returning ? 'Returning to app...' : 'Return to App'}
                </button>
            ) : (
                <p className='purchase-quills-subtitle'>
                    You can close this tab and return to the app.
                </p>
            )}
        </div>
    )
}