import { useState } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function AuthorRequestModal({ accessToken, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        bio: '',
        genre_interest: '',
        writing_sample_link: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const onChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.authorRequestSubmit}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_type: 'new_author',
                    bio: formData.bio || undefined,
                    genre_interest: formData.genre_interest || undefined,
                    writing_sample_link: formData.writing_sample_link || undefined,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                onSuccess()
            } else {
                setError(data.error || 'Could not submit request.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='modal-overlay' onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className='modal-box'>
                <div className='modal-box-header'>
                    <h2 className='modal-box-title'>Apply to Become an Author</h2>
                    <button className='modal-box-close' onClick={onClose} aria-label='Close'>✕</button>
                </div>

                <p className='section-note'>
                    Tell us a little about yourself and your writing. All fields are optional but help us make a decision faster.
                </p>

                <div className='bff-field'>
                    <label className='bff-label' htmlFor='bio'>About You</label>
                    <textarea
                        id='bio'
                        className='bff-textarea'
                        value={formData.bio}
                        onChange={(e) => onChange('bio', e.target.value)}
                        placeholder='Tell us about yourself as a writer...'
                        rows={4}
                        disabled={isSubmitting}
                    />
                </div>

                <div className='bff-field'>
                    <label className='bff-label' htmlFor='genre_interest'>Genre Interests</label>
                    <input
                        id='genre_interest'
                        type='text'
                        className='bff-input'
                        value={formData.genre_interest}
                        onChange={(e) => onChange('genre_interest', e.target.value)}
                        placeholder='e.g. Romance, Fantasy, Sci-Fi...'
                        disabled={isSubmitting}
                    />
                </div>

                <div className='bff-field'>
                    <label className='bff-label' htmlFor='writing_sample_link'>Writing Sample Link</label>
                    <input
                        id='writing_sample_link'
                        type='url'
                        className='bff-input'
                        value={formData.writing_sample_link}
                        onChange={(e) => onChange('writing_sample_link', e.target.value)}
                        placeholder='https://...'
                        disabled={isSubmitting}
                    />
                    <p className='bff-hint'>Link to any external writing samples (blog, Wattpad, Google Docs, etc.)</p>
                </div>

                {error && <p className='form-error'>{error}</p>}

                <div className='modal-box-actions'>
                    <button onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    )
}