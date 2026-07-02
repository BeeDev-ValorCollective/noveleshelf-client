import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DB_API, ENDPOINTS } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import '../../components/ProfileComponents/setAuthorUsername.css'

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/

export default function SetAuthorUsername() {
    const navigate = useNavigate()
    const currentRole = useAuthStore((state) => state.currentRole)
    const updateUser = useAuthStore((state) => state.updateUser)
    const [username, setUsername] = useState('')
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const endpoint = currentRole === 'author'
        ? ENDPOINTS.authorProfileUpdate
        : ENDPOINTS.freeAuthorProfileUpdate

    const handleSubmit = async () => {
        if (!username.trim()) {
            setError('Please enter a username.')
            return
        }

        if (!USERNAME_REGEX.test(username.trim())) {
            setError('Username can only contain letters, numbers, and underscores — no spaces or punctuation.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const accessToken = sessionStorage.getItem('access_token')

            const formData = new FormData()
            formData.append('author_username', username.trim())

            const res = await fetch(`${DB_API}${endpoint}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.')
                return
            }

            // re-fetch user so currentProfile picks up the new username
            const meRes = await fetch(`${DB_API}${ENDPOINTS.me}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            if (meRes.ok) {
                const userData = await meRes.json()
                updateUser(userData)
            }

            navigate('/dashboard')
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='set-username-page'>
            <div className='set-username-card'>
                <h1>Choose your author username</h1>
                <p>
                    Every author needs a unique username on Novel eShelf. It identifies and powers
                    your public author profile page. This is separate from your display name —
                    which can be your real name or pen name — and can be updated later in your
                    profile settings.
                </p>

                <div className='set-username-field'>
                    <label htmlFor='author-username'>Author username</label>
                    <p className='set-username-hint'>Letters, numbers, and underscores only — no spaces or punctuation.</p>
                    <input
                        id='author-username'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='e.g. inkslinger_42'
                        autoCapitalize='none'
                        autoCorrect='off'
                        maxLength={50}
                    />
                </div>

                {error && <p className='set-username-error'>{error}</p>}

                <button
                    className='set-username-btn'
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Set username'}
                </button>
            </div>
        </div>
    )
}