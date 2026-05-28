import { useState } from 'react'
import { DB_API } from '../../utils/api'

export default function TagGroup({ title, bookItems, allItems, itemKey, addEndpoint, removeEndpoint, authorType, bookId, accessToken, onBookUpdated, displayFn }) {
    const bookItemIds = new Set(bookItems.map((item) => item.id))

    const available = allItems.filter((item) => !bookItemIds.has(item.id))
    const added = bookItems

    const [toAdd, setToAdd] = useState(new Set())
    const [toRemove, setToRemove] = useState(new Set())
    const [isWorking, setIsWorking] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const toggleAdd = (id) => {
        setToAdd((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
        setSuccess(null)
    }

    const toggleRemove = (id) => {
        setToRemove((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
        setSuccess(null)
    }

    const handleAdd = async () => {
        if (toAdd.size === 0) return
        setIsWorking(true)
        setError(null)
        setSuccess(null)

        let lastBook = null
        let failed = 0

        for (const id of toAdd) {
            try {
                const res = await fetch(DB_API + addEndpoint, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        book_id: bookId,
                        author_type: authorType,
                        [itemKey]: id,
                    }),
                })
                const data = await res.json()
                if (res.ok) {
                    lastBook = data.book
                } else {
                    failed++
                }
            } catch {
                failed++
            }
        }

        if (lastBook) onBookUpdated(lastBook)
        setToAdd(new Set())
        setIsWorking(false)

        if (failed > 0) {
            setError(`${failed} item(s) could not be added.`)
        } else {
            setSuccess('Added successfully.')
        }
    }

    const handleRemove = async () => {
        if (toRemove.size === 0) return
        setIsWorking(true)
        setError(null)
        setSuccess(null)

        let lastBook = null
        let failed = 0

        for (const id of toRemove) {
            try {
                const res = await fetch(DB_API + removeEndpoint, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        book_id: bookId,
                        author_type: authorType,
                        [itemKey]: id,
                    }),
                })
                const data = await res.json()
                if (res.ok) {
                    lastBook = data.book
                } else {
                    failed++
                }
            } catch {
                failed++
            }
        }

        if (lastBook) onBookUpdated(lastBook)
        setToRemove(new Set())
        setIsWorking(false)

        if (failed > 0) {
            setError(`${failed} item(s) could not be removed.`)
        } else {
            setSuccess('Removed successfully.')
        }
    }

    return (
        <div className='tag-group'>
            <h3>{title}</h3>

            {error && <p className='form-error'>{error}</p>}
            {success && <p className='form-success'>{success}</p>}

            {added.length > 0 && (
                <div className='tag-subsection'>
                    <p className='tag-subsection-label'>Currently added — select to remove</p>
                    <div className='tag-checkbox-list'>
                        {added.map((item) => (
                            <label key={item.id} className='tag-checkbox-item'>
                                <input
                                    type='checkbox'
                                    checked={toRemove.has(item.id)}
                                    onChange={() => toggleRemove(item.id)}
                                    disabled={isWorking}
                                />
                                {displayFn(item)}
                            </label>
                        ))}
                    </div>
                    <button onClick={handleRemove} disabled={isWorking || toRemove.size === 0}>
                        {isWorking ? 'Working...' : `Remove Selected (${toRemove.size})`}
                    </button>
                </div>
            )}

            {available.length > 0 && (
                <div className='tag-subsection'>
                    <p className='tag-subsection-label'>Available — select to add</p>
                    <div className='tag-checkbox-list'>
                        {available.map((item) => (
                            <label key={item.id} className='tag-checkbox-item'>
                                <input
                                    type='checkbox'
                                    checked={toAdd.has(item.id)}
                                    onChange={() => toggleAdd(item.id)}
                                    disabled={isWorking}
                                />
                                {displayFn(item)}
                            </label>
                        ))}
                    </div>
                    <button onClick={handleAdd} disabled={isWorking || toAdd.size === 0}>
                        {isWorking ? 'Working...' : `Add Selected (${toAdd.size})`}
                    </button>
                </div>
            )}

            {available.length === 0 && added.length === 0 && (
                <p className='tag-empty'>No options available.</p>
            )}
        </div>
    )
}