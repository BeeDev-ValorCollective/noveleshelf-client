import { useEffect, useState } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'
import './adminDash.css'

export default function GiftInkPanel({ accessToken }) {
    const [users, setUsers] = useState([])
    const [selectedUserId, setSelectedUserId] = useState('')
    const [search, setSearch] = useState('')
    const [amount, setAmount] = useState('')
    const [notes, setNotes] = useState('')

    const [isLoadingUsers, setIsLoadingUsers] = useState(true)
    const [isWorking, setIsWorking] = useState(false)

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        if (!accessToken) return

        fetchUsers()
    }, [accessToken])

    const fetchUsers = async () => {
        setIsLoadingUsers(true)
        setError(null)

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminListUsers}?page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
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
        } catch {
            setError('Unable to load users.')
        } finally {
            setIsLoadingUsers(false)
        }
    }

    const filteredUsers = users.filter((user) =>
        user.email
            ?.toLowerCase()
            .includes(search.toLowerCase())
    )

    const selectedUser = users.find(
        (user) => String(user.id) === String(selectedUserId)
    )

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
                        disabled={
                            isWorking || isLoadingUsers
                        }
                    />
                </div>

                <div className='admin-gift-field'>
                    <label htmlFor='gift-user'>
                        Recipient
                    </label>

                    <select
                        id='gift-user'
                        className='bff-select admin-gift-user-select'
                        value={selectedUserId}
                        onChange={(event) =>
                            setSelectedUserId(event.target.value)
                        }
                        disabled={isWorking || isLoadingUsers}
                    >
                        <option value=''>
                            {isLoadingUsers
                                ? 'Loading users...'
                                : 'Select a user'}
                        </option>

                        {filteredUsers.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.email}
                            </option>
                        ))}
                    </select>
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

                <button
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
                        : 'Gift Black Ink'}
                </button>
            </form>
        </section>
    )
}