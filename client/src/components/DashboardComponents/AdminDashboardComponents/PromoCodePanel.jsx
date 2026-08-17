import { useEffect, useState } from 'react'
import { DB_API, ENDPOINTS } from '../../../utils/api'

import './adminDash.css'


export default function PromoCodePanel({ accessToken }) {
    const [codes, setCodes] = useState([])

    // Create form
    const [code, setCode] = useState('')
    const [amount, setAmount] = useState('')
    const [maxRedemptions, setMaxRedemptions] =
        useState('')
    const [expiresAt, setExpiresAt] =
        useState('')

    // Editing
    const [editingCode, setEditingCode] =
        useState(null)

    const [editAmount, setEditAmount] =
        useState('')

    const [editMaxRedemptions, setEditMaxRedemptions] =
        useState('')

    const [editExpiresAt, setEditExpiresAt] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [creating, setCreating] =
        useState(false)

    const [saving, setSaving] =
        useState(false)

    const [togglingCode, setTogglingCode] =
        useState(null)

    const [error, setError] =
        useState('')

    const [success, setSuccess] =
        useState('')


    useEffect(() => {
        if (!accessToken) return

        fetchCodes()
    }, [accessToken])


    const fetchCodes = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminListPromoCodes}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            )

            const data = await response
                .json()
                .catch(() => [])

            if (!response.ok) {
                setError(
                    data?.detail ||
                    'Unable to load promo codes.'
                )

                return
            }

            setCodes(
                Array.isArray(data)
                    ? data
                    : []
            )

        } catch (err) {
            console.error(
                'Promo code list error:',
                err
            )

            setError(
                'Unable to connect to the server.'
            )
        } finally {
            setLoading(false)
        }
    }


    const handleCreate = async (event) => {
        event.preventDefault()

        setError('')
        setSuccess('')

        const cleanCode =
            code.trim().toUpperCase()

        const parsedAmount =
            Number.parseInt(amount, 10)

        if (!cleanCode) {
            setError(
                'A promo code is required.'
            )
            return
        }

        if (
            !Number.isInteger(parsedAmount) ||
            parsedAmount <= 0
        ) {
            setError(
                'Amount must be a positive whole number.'
            )
            return
        }

        let parsedMaxRedemptions = null

        if (maxRedemptions.trim()) {
            parsedMaxRedemptions =
                Number.parseInt(
                    maxRedemptions,
                    10
                )

            if (
                !Number.isInteger(
                    parsedMaxRedemptions
                ) ||
                parsedMaxRedemptions <= 0
            ) {
                setError(
                    'Maximum redemptions must be a positive whole number.'
                )

                return
            }
        }

        let expirationIso = null

        if (expiresAt) {
            const expirationDate =
                new Date(expiresAt)

            if (
                Number.isNaN(
                    expirationDate.getTime()
                )
            ) {
                setError(
                    'Please enter a valid expiration date.'
                )

                return
            }

            expirationIso =
                expirationDate.toISOString()
        }

        const confirmed = window.confirm(
            `Create promo code ${cleanCode} for ${parsedAmount} Black Ink?`
        )

        if (!confirmed) return

        setCreating(true)

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminCreatePromoCode}`,
                {
                    method: 'POST',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,

                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        code: cleanCode,
                        currency_type:
                            'black_ink',
                        amount:
                            parsedAmount,
                        expires_at:
                            expirationIso,
                        max_redemptions:
                            parsedMaxRedemptions,
                    }),
                }
            )

            const data = await response
                .json()
                .catch(() => ({}))

            if (!response.ok) {
                handleApiError(
                    data,
                    'Unable to create promo code.'
                )

                return
            }

            setSuccess(
                `Promo code ${data.code} created successfully.`
            )

            setCode('')
            setAmount('')
            setMaxRedemptions('')
            setExpiresAt('')

            setCodes((current) => [
                data,
                ...current,
            ])

        } catch (err) {
            console.error(
                'Promo code create error:',
                err
            )

            setError(
                'Unable to connect to the server.'
            )
        } finally {
            setCreating(false)
        }
    }


    const handleApiError = (
        data,
        fallback
    ) => {
        const detail =
            data?.detail ||
            data?.error

        if (
            detail &&
            typeof detail === 'object'
        ) {
            setError(
                Object.values(detail)
                    .flat()
                    .join(' ')
            )

            return
        }

        setError(
            detail || fallback
        )
    }


    const startEdit = (promo) => {
        setError('')
        setSuccess('')

        setEditingCode(promo.code)

        setEditAmount(
            String(promo.amount ?? '')
        )

        setEditMaxRedemptions(
            promo.max_redemptions === null
                ? ''
                : String(
                    promo.max_redemptions
                )
        )

        setEditExpiresAt(
            toDateTimeLocal(
                promo.expires_at
            )
        )
    }


    const cancelEdit = () => {
        setEditingCode(null)

        setEditAmount('')
        setEditMaxRedemptions('')
        setEditExpiresAt('')
    }


    const handleSaveEdit = async (promo) => {
        setError('')
        setSuccess('')

        const parsedAmount =
            Number.parseInt(
                editAmount,
                10
            )

        if (
            !Number.isInteger(parsedAmount) ||
            parsedAmount <= 0
        ) {
            setError(
                'Amount must be a positive whole number.'
            )

            return
        }

        let parsedMaxRedemptions = null

        if (
            editMaxRedemptions.trim()
        ) {
            parsedMaxRedemptions =
                Number.parseInt(
                    editMaxRedemptions,
                    10
                )

            if (
                !Number.isInteger(
                    parsedMaxRedemptions
                ) ||
                parsedMaxRedemptions <= 0
            ) {
                setError(
                    'Maximum redemptions must be a positive whole number.'
                )

                return
            }

            if (
                parsedMaxRedemptions <
                promo.times_redeemed
            ) {
                setError(
                    `Maximum redemptions cannot be lower than the ${promo.times_redeemed} redemptions already used.`
                )

                return
            }
        }

        let expirationIso = null

        if (editExpiresAt) {
            const expirationDate =
                new Date(editExpiresAt)

            if (
                Number.isNaN(
                    expirationDate.getTime()
                )
            ) {
                setError(
                    'Please enter a valid expiration date.'
                )

                return
            }

            expirationIso =
                expirationDate.toISOString()
        }

        setSaving(true)

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminUpdatePromoCode(
                    promo.code
                )}`,
                {
                    method: 'PATCH',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,

                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        amount:
                            parsedAmount,

                        max_redemptions:
                            parsedMaxRedemptions,

                        expires_at:
                            expirationIso,
                    }),
                }
            )

            const data = await response
                .json()
                .catch(() => ({}))

            if (!response.ok) {
                handleApiError(
                    data,
                    'Unable to update promo code.'
                )

                return
            }

            setCodes((current) =>
                current.map((item) =>
                    item.code === promo.code
                        ? data
                        : item
                )
            )

            setSuccess(
                `Promo code ${promo.code} updated successfully.`
            )

            cancelEdit()

        } catch (err) {
            console.error(
                'Promo code update error:',
                err
            )

            setError(
                'Unable to connect to the server.'
            )
        } finally {
            setSaving(false)
        }
    }


    const handleToggleActive = async (
        promo
    ) => {
        setError('')
        setSuccess('')

        const nextActive =
            !promo.is_active

        const action =
            nextActive
                ? 'activate'
                : 'deactivate'

        const confirmed =
            window.confirm(
                `${action === 'activate'
                    ? 'Activate'
                    : 'Deactivate'
                } promo code ${promo.code}?`
            )

        if (!confirmed) return

        setTogglingCode(
            promo.code
        )

        try {
            const response = await fetch(
                `${DB_API}${ENDPOINTS.adminUpdatePromoCode(
                    promo.code
                )}`,
                {
                    method: 'PATCH',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,

                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        is_active:
                            nextActive,
                    }),
                }
            )

            const data = await response
                .json()
                .catch(() => ({}))

            if (!response.ok) {
                handleApiError(
                    data,
                    `Unable to ${action} promo code.`
                )

                return
            }

            setCodes((current) =>
                current.map((item) =>
                    item.code === promo.code
                        ? data
                        : item
                )
            )

            setSuccess(
                `${promo.code} ${
                    nextActive
                        ? 'activated'
                        : 'deactivated'
                } successfully.`
            )

        } catch (err) {
            console.error(
                'Promo code toggle error:',
                err
            )

            setError(
                'Unable to connect to the server.'
            )
        } finally {
            setTogglingCode(null)
        }
    }


    const toDateTimeLocal = (
        value
    ) => {
        if (!value) {
            return ''
        }

        const date = new Date(value)

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return ''
        }

        const offset =
            date.getTimezoneOffset()

        const localDate =
            new Date(
                date.getTime() -
                offset * 60000
            )

        return localDate
            .toISOString()
            .slice(0, 16)
    }


    const formatDate = (
        value
    ) => {
        if (!value) {
            return 'Never'
        }

        const date =
            new Date(value)

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return 'Unknown'
        }

        return date.toLocaleString()
    }


    const getStatus = (
        promo
    ) => {
        if (!promo.is_active) {
            return {
                label: 'Inactive',
                className:
                    'promo-status promo-status--inactive',
            }
        }

        if (
            promo.expires_at &&
            new Date(
                promo.expires_at
            ) < new Date()
        ) {
            return {
                label: 'Expired',
                className:
                    'promo-status promo-status--expired',
            }
        }

        if (
            promo.max_redemptions !== null &&
            promo.times_redeemed >=
                promo.max_redemptions
        ) {
            return {
                label: 'Used Up',
                className:
                    'promo-status promo-status--used',
            }
        }

        return {
            label: 'Active',
            className:
                'promo-status promo-status--active',
        }
    }


    return (
        <section className="admin-promo-panel">

            <div className="admin-promo-header">
                <div>
                    <h2>
                        Promo Codes
                    </h2>

                    <p>
                        Create and manage Black Ink
                        promotional codes.
                    </p>
                </div>
            </div>


            {/* ─── Create Promo Code ─── */}

            <form
                className="admin-promo-form"
                onSubmit={handleCreate}
            >

                <div className="admin-promo-field">
                    <label htmlFor="promo-code">
                        Code
                    </label>

                    <input
                        id="promo-code"
                        type="text"

                        value={code}

                        onChange={(event) =>
                            setCode(
                                event.target.value
                                    .toUpperCase()
                            )
                        }

                        placeholder="BOOKFAIR26"

                        disabled={
                            creating
                        }
                    />
                </div>


                <div className="admin-promo-field">
                    <label htmlFor="promo-amount">
                        Black Ink
                    </label>

                    <input
                        id="promo-amount"
                        type="number"

                        min="1"
                        step="1"

                        value={amount}

                        onChange={(event) =>
                            setAmount(
                                event.target.value
                            )
                        }

                        placeholder="25"

                        disabled={
                            creating
                        }
                    />
                </div>


                <div className="admin-promo-field">
                    <label htmlFor="promo-max">
                        Max Redemptions
                    </label>

                    <input
                        id="promo-max"
                        type="number"

                        min="1"
                        step="1"

                        value={
                            maxRedemptions
                        }

                        onChange={(event) =>
                            setMaxRedemptions(
                                event.target.value
                            )
                        }

                        placeholder="Unlimited"

                        disabled={
                            creating
                        }
                    />
                </div>


                <div className="admin-promo-field">
                    <label htmlFor="promo-expiration">
                        Expires
                    </label>

                    <input
                        id="promo-expiration"
                        type="datetime-local"

                        value={
                            expiresAt
                        }

                        onChange={(event) =>
                            setExpiresAt(
                                event.target.value
                            )
                        }

                        disabled={
                            creating
                        }
                    />
                </div>


                {error && (
                    <p className="admin-promo-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="admin-promo-success">
                        {success}
                    </p>
                )}


                <button
                    type="submit"

                    className="admin-promo-create-btn"

                    disabled={
                        creating ||
                        !code.trim() ||
                        !amount
                    }
                >
                    {creating
                        ? 'Creating...'
                        : 'Create Promo Code'}
                </button>

            </form>


            {/* ─── Existing Promo Codes ─── */}

            <div className="admin-promo-list-section">

                <div className="admin-promo-list-heading">

                    <h3>
                        Existing Promo Codes
                    </h3>

                    <button
                        type="button"

                        className="admin-promo-refresh"

                        onClick={
                            fetchCodes
                        }

                        disabled={
                            loading
                        }
                    >
                        Refresh
                    </button>

                </div>


                {loading ? (

                    <p className="admin-promo-empty">
                        Loading promo codes...
                    </p>

                ) : codes.length === 0 ? (

                    <p className="admin-promo-empty">
                        No promo codes have been
                        created yet.
                    </p>

                ) : (

                    <div className="admin-promo-list">

                        {codes.map((promo) => {
                            const status =
                                getStatus(promo)

                            const isEditing =
                                editingCode ===
                                promo.code

                            const isToggling =
                                togglingCode ===
                                promo.code

                            return (
                                <div
                                    key={promo.code}

                                    className="admin-promo-card"
                                >

                                    <div className="admin-promo-card-top">

                                        <div className="admin-promo-card-title">

                                            <strong className="admin-promo-code">
                                                {promo.code}
                                            </strong>

                                            <span
                                                className={
                                                    status.className
                                                }
                                            >
                                                {status.label}
                                            </span>

                                        </div>


                                        <span className="admin-promo-value">
                                            +{promo.amount}
                                            {' '}
                                            Black Ink
                                        </span>

                                    </div>


                                    {isEditing ? (

                                        <div className="admin-promo-edit-form">

                                            <div className="admin-promo-field">
                                                <label>
                                                    Black Ink
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"

                                                    value={
                                                        editAmount
                                                    }

                                                    onChange={(event) =>
                                                        setEditAmount(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>


                                            <div className="admin-promo-field">
                                                <label>
                                                    Max Redemptions
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="1"

                                                    value={
                                                        editMaxRedemptions
                                                    }

                                                    onChange={(event) =>
                                                        setEditMaxRedemptions(
                                                            event.target.value
                                                        )
                                                    }

                                                    placeholder="Unlimited"
                                                />
                                            </div>


                                            <div className="admin-promo-field">
                                                <label>
                                                    Expires
                                                </label>

                                                <input
                                                    type="datetime-local"

                                                    value={
                                                        editExpiresAt
                                                    }

                                                    onChange={(event) =>
                                                        setEditExpiresAt(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            </div>


                                            <div className="admin-promo-edit-actions">

                                                <button
                                                    type="button"

                                                    className="admin-promo-save-btn"

                                                    onClick={() =>
                                                        handleSaveEdit(
                                                            promo
                                                        )
                                                    }

                                                    disabled={
                                                        saving
                                                    }
                                                >
                                                    {saving
                                                        ? 'Saving...'
                                                        : 'Save'}
                                                </button>


                                                <button
                                                    type="button"

                                                    className="admin-promo-cancel-btn"

                                                    onClick={
                                                        cancelEdit
                                                    }

                                                    disabled={
                                                        saving
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <>
                                            <div className="admin-promo-details">

                                                <div>
                                                    <span>
                                                        Redeemed
                                                    </span>

                                                    <strong>
                                                        {promo.times_redeemed}

                                                        {promo.max_redemptions !==
                                                        null
                                                            ? ` / ${promo.max_redemptions}`
                                                            : ' / Unlimited'}
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Expires
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            promo.expires_at
                                                        )}
                                                    </strong>
                                                </div>


                                                <div>
                                                    <span>
                                                        Created
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            promo.created_at
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>


                                            <div className="admin-promo-actions">

                                                <button
                                                    type="button"

                                                    className="admin-promo-edit-btn"

                                                    onClick={() =>
                                                        startEdit(
                                                            promo
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"

                                                    className={
                                                        promo.is_active
                                                            ? 'admin-promo-toggle-btn admin-promo-toggle-btn--deactivate'
                                                            : 'admin-promo-toggle-btn admin-promo-toggle-btn--activate'
                                                    }

                                                    onClick={() =>
                                                        handleToggleActive(
                                                            promo
                                                        )
                                                    }

                                                    disabled={
                                                        isToggling
                                                    }
                                                >
                                                    {isToggling
                                                        ? 'Updating...'
                                                        : promo.is_active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>

                                            </div>
                                        </>

                                    )}

                                </div>
                            )
                        })}

                    </div>
                )}

            </div>

        </section>
    )
}