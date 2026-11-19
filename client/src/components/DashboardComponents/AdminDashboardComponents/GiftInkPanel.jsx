import { useEffect, useState } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import Button from '../../ui/Button'
import Select from '../../ui/Select'
import './adminDash.css'

export default function GiftInkPanel({ accessToken }) {
    const [users, setUsers] = useState([])
    // Keep the chosen user as an object so it survives a new search
    // that no longer includes them.
    const [selectedUser, setSelectedUser] = useState(null)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [amount, setAmount] = useState('')
    const [notes, setNotes] = useState('')

    const [isLoadingUsers, setIsLoadingUsers] = useState(true)
    const [isWorking, setIsWorking] = useState(false)

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    // Search runs on the server; wait for typing to pause before fetching.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        if (!accessToken) return

        // Abort the previous search so an older response can't overwrite a newer one.
        const controller = new AbortController()
        fetchUsers(controller.signal)
        return () => controller.abort()
    }, [accessToken, debouncedSearch])

    const fetchUsers = async (signal) => {
        setIsLoadingUsers(true)
        setError(null)

        try {
            const params = new URLSearchParams({ page: 1, page_size: 25, order: 'az' })
            if (debouncedSearch) params.append('search', debouncedSearch)

            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminListUsers}?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    signal,
                }
            )

            const data = await response.json()

            if (response.ok) {
                setUsers(data.results || [])
            } else {
                setError(
                    data.error ||
                    data.detail ||
                    'Could not load users.'
                )
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            setError('Unable to load users.')
        } finally {
            if (!signal.aborted) setIsLoadingUsers(false)
        }
    }

    const selectedUserId = selectedUser ? String(selectedUser.id) : ''

    // Server results, plus the selected user if the current search hides them.
    const userOptions =
        selectedUser && !users.some((user) => user.id === selectedUser.id)
            ? [selectedUser, ...users]
            : users

    const handleSelectUser = (id) => {
        setSelectedUser(userOptions.find((user) => String(user.id) === id) || null)
    }

    const handleGift = async (event) => {
        event.preventDefault()

        setError(null)
        setSuccess(null)

        const parsedAmount = Number.parseInt(amount, 10)

        if (!selectedUserId) {
            setError('Please select a user.')
            return
        }

        if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
            setError('Gift amount must be a positive whole number.')
            return
        }

        const confirmed = window.confirm(
            `Gift ${parsedAmount} Black Ink ${
                parsedAmount === 1 ? 'drop' : 'drops'
            } to ${selectedUser?.email}?`
        )

        if (!confirmed) {
            return
        }

        setIsWorking(true)

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminGiftCurrency}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: selectedUserId,
                        amount: parsedAmount,
                        notes: notes.trim() || 'Admin gift',
                    }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                setSuccess(
                    `${data.detail} New Black Ink balance: ${
                        data.wallet?.black_ink_balance ?? '—'
                    }.`
                )

                setAmount('')
                setNotes('')
            } else {
                setError(
                    data.detail ||
                    data.error ||
                    'Could not gift Black Ink.'
                )
            }
        } catch {
            setError(
                'Unable to connect. Please try again.'
            )
        } finally {
            setIsWorking(false)
        }
    }

    return (
        <section className='dashboard-section admin-gift-panel'>
            <div className='admin-gift-header'>
                <div>
                    <h2>Gift Black Ink</h2>
                    <p>
                        Add Black Ink drops directly to a reader's wallet.
                    </p>
                </div>
            </div>

            {error && (
                <p className='form-error'>{error}</p>
            )}

            {success && (
                <p className='form-success'>{success}</p>
            )}

            <form
                className='admin-gift-form'
                onSubmit={handleGift}
            >
                <div className='admin-gift-field'>
                    <label htmlFor='gift-user-search'>
                        Find User
                    </label>

                    <input
                        id='gift-user-search'
                        type='text'
                        className='bff-input'
                        placeholder='Search by email...'
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        disabled={isWorking}
                    />
                </div>

                <div className='admin-gift-field'>
                    <label htmlFor='gift-user'>
                        Recipient
                    </label>

                    <Select
                        variant='form'
                        id='gift-user'
                        className='bff-select admin-gift-user-select'
                        value={selectedUserId}
                        onChange={(event) =>
                            handleSelectUser(event.target.value)
                        }
                        disabled={isWorking || isLoadingUsers}
                    >
                        <option value=''>
                            {isLoadingUsers
                                ? 'Loading users...'
                                : 'Select a user'}
                        </option>

                        {userOptions.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.email}
                            </option>
                        ))}
                    </Select>

                </div>

                <div className='admin-gift-field'>
                    <label htmlFor='gift-amount'>
                        Black Ink Drops
                    </label>

                    <input
                        id='gift-amount'
                        type='number'
                        className='bff-input'
                        min='1'
                        step='1'
                        value={amount}
                        onChange={(event) =>
                            setAmount(event.target.value)
                        }
                        placeholder='25'
                        disabled={isWorking}
                    />
                </div>

                <div className='admin-gift-field admin-gift-field--notes'>
                    <label htmlFor='gift-notes'>
                        Reason / Notes
                    </label>

                    <textarea
                        id='gift-notes'
                        className='bff-input admin-gift-notes'
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.target.value)
                        }
                        placeholder='Optional reason for the gift...'
                        disabled={isWorking}
                        rows={3}
                    />
                </div>

                {selectedUser && (
                    <div className='admin-gift-summary'>
                        <span>Recipient</span>
                        <strong>{selectedUser.email}</strong>
                    </div>
                )}

                <Button
                    variant='tertiary'
                    type='submit'
                    className='admin-gift-button'
                    disabled={
                        isWorking ||
                        !selectedUserId ||
                        !amount
                    }
                >
                    {isWorking
                        ? 'Gifting...'
                        : 'Gift Black Ink'
                    }
                </Button>

            </form>
        </section>
    )
}