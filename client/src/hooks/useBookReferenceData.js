// hooks/useBookReferenceData.js
import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { DB_API, ENDPOINTS } from '../utils/api'

export default function useBookReferenceData() {
    const accessToken = useAuthStore((state) => state.accessToken)
    const [referenceData, setReferenceData] = useState({
        genres: [],
        keywords: [],
        relationship_tags: [],
        content_ratings: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchReferenceData = async () => {
            try {
                const res = await fetch(`${DB_API}${ENDPOINTS.referenceData}`)
                const data = await res.json()
                if (res.ok) {
                    setReferenceData(data)
                } else {
                    setError(data.error || 'Failed to load reference data')
                }
            } catch (err) {
                setError('Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchReferenceData()
    }, []) // no accessToken dependency either

    return { ...referenceData, isLoading, error }
}