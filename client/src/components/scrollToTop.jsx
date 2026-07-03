// components/ScrollToTop.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
    const location = useLocation()

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo(0, 0)
        }
        // if there IS a hash, do nothing here — let the page-level
        // hash-scroll effect (like the one in ManageBook) handle it
    }, [location.pathname, location.hash])

    return null
}