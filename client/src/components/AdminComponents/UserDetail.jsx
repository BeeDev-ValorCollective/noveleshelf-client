import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS } from '../../utils/api'
import Button from '../ui/Button'

export default function UserDetail({ user, accessToken, isSuperAdmin, onUpdated, onClose }) {
    const [isWorking, setIsWorking] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [authorForm, setAuthorForm] = useState({
        first_name: '',
        last_name: '',
    })

    const [authorUpdateForm, setAuthorUpdateForm] = useState({
        tier: user.author_profile?.tier || 1,
        contract_link: user.author_profile?.contract_link || '',
        first_name: user.author_profile?.first_name || '',
        last_name: user.author_profile?.last_name || '',
        is_publicly_visible: user.author_profile?.is_publicly_visible || false,
        is_featured: user.author_profile?.is_featured || false,
        free_chapters: user.author_profile?.free_chapters || 10,
    })

    const [freeAuthorUpdateForm, setFreeAuthorUpdateForm] = useState({
        is_publicly_visible: user.free_author_profile?.is_publicly_visible || false,
        is_featured: user.free_author_profile?.is_featured || false,
        is_active: user.free_author_profile?.is_active !== false,
    })

    useEffect(() => {
        setError(null)
        setSuccess(null)
        setAuthorForm({ first_name: '', last_name: '' })
        setAuthorUpdateForm({
            tier: user.author_profile?.tier || 1,
            contract_link: user.author_profile?.contract_link || '',
            first_name: user.author_profile?.first_name || '',
            last_name: user.author_profile?.last_name || '',
            is_publicly_visible: user.author_profile?.is_publicly_visible || false,
            is_featured: user.author_profile?.is_featured || false,
            free_chapters: user.author_profile?.free_chapters || 10,
        })
        setFreeAuthorUpdateForm({
            is_publicly_visible: user.free_author_profile?.is_publicly_visible || false,
            is_featured: user.free_author_profile?.is_featured || false,
            is_active: user.free_author_profile?.is_active !== false,
        })
    }, [user.id])

    const refreshUser = async () => {
        const res = await fetch(`${DB_API}${ENDPOINTS.adminListUsers}?page=1`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        const data = await res.json()
        const updatedUser = data.results?.find(u => u.id === user.id)
        if (updatedUser) onUpdated(updatedUser)
    }

    const handleUpgrade = async (endpoint, body, successMsg) => {
        setIsWorking(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${endpoint}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess(successMsg || data.message)
                await refreshUser()
            } else {
                setError(data.error || 'Could not complete upgrade.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsWorking(false)
        }
    }

    const handleAuthorProfileUpdate = async () => {
        setIsWorking(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminAuthorUpdate}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    tier: Number(authorUpdateForm.tier),
                    contract_link: authorUpdateForm.contract_link || undefined,
                    first_name: authorUpdateForm.first_name || undefined,
                    last_name: authorUpdateForm.last_name || undefined,
                    is_publicly_visible: authorUpdateForm.is_publicly_visible,
                    is_featured: authorUpdateForm.is_featured,
                    free_chapters: Number(authorUpdateForm.free_chapters),
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Author profile updated.')
                onUpdated({ ...user, author_profile: data.author_profile })
            } else {
                setError(data.error || 'Could not update author profile.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsWorking(false)
        }
    }

    const handleFreeAuthorUpdate = async () => {
        setIsWorking(true)
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.adminFreeAuthorUpdate}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    ...freeAuthorUpdateForm,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Free author profile updated.')
                onUpdated({ ...user, free_author_profile: data.free_author_profile })
            } else {
                setError(data.error || 'Could not update free author profile.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsWorking(false)
        }
    }

    const hasPaidAuthor = !!user.author_profile
    const hasFreeAuthor = !!user.free_author_profile
    const hasModerator = !!user.moderator_profile
    const hasAdmin = !!user.admin_profile

    return (
        <div className='request-detail'>
            <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
            >
                ✕ Close
            </Button>

            <h2 className='request-detail-title'>{user.email}</h2>
            <p className='request-detail-date'>
                Verified: {user.is_verified ? '✓' : '✗'} · 
                Default role: {user.default_login_role}
            </p>

            {error && <p className='form-error'>{error}</p>}
            {success && <p className='form-success'>{success}</p>}

            {/* ─── Role Upgrades ─── */}
            <div className='request-detail-section'>
                <label className='bff-label'>Role Upgrades</label>
                <div className='book-approval-actions' style={{ marginTop: '8px' }}>
                    {!hasPaidAuthor && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type='text'
                                    className='bff-input'
                                    placeholder='First name *'
                                    value={authorForm.first_name}
                                    onChange={(e) => setAuthorForm(prev => ({ ...prev, first_name: e.target.value }))}
                                    disabled={isWorking}
                                />
                                <input
                                    type='text'
                                    className='bff-input'
                                    placeholder='Last name *'
                                    value={authorForm.last_name}
                                    onChange={(e) => setAuthorForm(prev => ({ ...prev, last_name: e.target.value }))}
                                    disabled={isWorking}
                                />
                            </div>
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={() => {
                                    if (!authorForm.first_name || !authorForm.last_name) {
                                        setError('First and last name are required to upgrade to author.')
                                        return
                                    }
                                    handleUpgrade(ENDPOINTS.adminUpgradeToAuthor, {
                                        user_id: user.id,
                                        first_name: authorForm.first_name,
                                        last_name: authorForm.last_name,
                                    }, `${user.email} upgraded to paid author.`)
                                }}
                                disabled={isWorking}
                            >
                                Upgrade to Paid Author
                            </Button>
                        </div>
                    )}
                    {!hasModerator && (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleUpgrade(ENDPOINTS.adminUpgradeToModerator, {
                                    user_id: user.id,
                                }, `${user.email} upgraded to moderator.`)}
                            disabled={isWorking}
                        >
                            Upgrade to Moderator
                        </Button>
                    )}
                    {!hasAdmin && (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleUpgrade(ENDPOINTS.adminUpgradeToAdmin, {
                                user_id: user.id,
                            }, `${user.email} upgraded to admin.`)}
                            disabled={isWorking}
                        >
                            Upgrade to Admin
                        </Button>
                    )}
                    {hasPaidAuthor && hasModerator && hasAdmin && (
                        <p className='section-note'>User has all available roles.</p>
                    )}
                </div>
            </div>

            {/* ─── Paid Author Profile ─── */}
            {hasPaidAuthor && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Paid Author Profile</label>

                    <div className='bff-field'>
                        <label className='bff-label' htmlFor='author-tier'>Tier</label>
                        <select
                            id='author-tier'
                            className='bff-select'
                            value={authorUpdateForm.tier}
                            onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, tier: e.target.value }))}
                            disabled={isWorking}
                        >
                            {[1, 2, 3, 4, 5].map(t => (
                                <option key={t} value={t}>Tier {t}</option>
                            ))}
                        </select>
                    </div>

                    <div className='bff-field'>
                        <label className='bff-label' htmlFor='author-contract'>Contract Link</label>
                        <input
                            id='author-contract'
                            type='url'
                            className='bff-input'
                            value={authorUpdateForm.contract_link}
                            onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, contract_link: e.target.value }))}
                            placeholder='https://drive.google.com/...'
                            disabled={isWorking}
                        />
                    </div>

                    <div className='bff-field'>
                        <label className='bff-label' htmlFor='author-free-chapters'>Free Chapters Default</label>
                        <input
                            id='author-free-chapters'
                            type='number'
                            className='bff-input'
                            value={authorUpdateForm.free_chapters}
                            onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, free_chapters: e.target.value }))}
                            min={0}
                            disabled={isWorking}
                        />
                    </div>

                    <div className='bff-field'>
                        <label className='bff-label' htmlFor='author-first'>First Name</label>
                        <input
                            id='author-first'
                            type='text'
                            className='bff-input'
                            value={authorUpdateForm.first_name}
                            onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, first_name: e.target.value }))}
                            disabled={isWorking}
                        />
                    </div>

                    <div className='bff-field'>
                        <label className='bff-label' htmlFor='author-last'>Last Name</label>
                        <input
                            id='author-last'
                            type='text'
                            className='bff-input'
                            value={authorUpdateForm.last_name}
                            onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, last_name: e.target.value }))}
                            disabled={isWorking}
                        />
                    </div>

                    <div className='bff-field bff-field--toggle'>
                        <label className='bff-label bff-label--toggle' htmlFor='author-visible'>
                            <input
                                id='author-visible'
                                type='checkbox'
                                checked={authorUpdateForm.is_publicly_visible}
                                onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, is_publicly_visible: e.target.checked }))}
                                disabled={isWorking}
                            />
                            Publicly visible
                        </label>
                    </div>

                    <div className='bff-field bff-field--toggle'>
                        <label className='bff-label bff-label--toggle' htmlFor='author-featured'>
                            <input
                                id='author-featured'
                                type='checkbox'
                                checked={authorUpdateForm.is_featured}
                                onChange={(e) => setAuthorUpdateForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                disabled={isWorking}
                            />
                            Featured author
                        </label>
                    </div>

                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleAuthorProfileUpdate}
                        disabled={isWorking}
                    >
                        {isWorking ? 'Saving...' : 'Save Author Profile'}
                    </Button>

                </div>
            )}

            {/* ─── Free Author Profile ─── */}
            {hasFreeAuthor && (
                <div className='request-detail-section'>
                    <label className='bff-label'>Free Author Profile</label>

                    <div className='bff-field bff-field--toggle'>
                        <label className='bff-label bff-label--toggle' htmlFor='free-visible'>
                            <input
                                id='free-visible'
                                type='checkbox'
                                checked={freeAuthorUpdateForm.is_publicly_visible}
                                onChange={(e) => setFreeAuthorUpdateForm(prev => ({ ...prev, is_publicly_visible: e.target.checked }))}
                                disabled={isWorking}
                            />
                            Publicly visible
                        </label>
                    </div>

                    <div className='bff-field bff-field--toggle'>
                        <label className='bff-label bff-label--toggle' htmlFor='free-featured'>
                            <input
                                id='free-featured'
                                type='checkbox'
                                checked={freeAuthorUpdateForm.is_featured}
                                onChange={(e) => setFreeAuthorUpdateForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                disabled={isWorking}
                            />
                            Featured author
                        </label>
                    </div>

                    <div className='bff-field bff-field--toggle'>
                        <label className='bff-label bff-label--toggle' htmlFor='free-active'>
                            <input
                                id='free-active'
                                type='checkbox'
                                checked={freeAuthorUpdateForm.is_active}
                                onChange={(e) => setFreeAuthorUpdateForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                disabled={isWorking}
                            />
                            Active
                        </label>
                    </div>

                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={handleFreeAuthorUpdate}
                        disabled={isWorking}
                    >
                        {isWorking ? 'Saving...' : 'Save Free Author Profile'}
                    </Button>
                    {/* <button onClick={handleFreeAuthorUpdate} disabled={isWorking}>
                        {isWorking ? 'Saving...' : 'Save Free Author Profile'}
                    </button> */}
                </div>
            )}
        </div>
    )
}