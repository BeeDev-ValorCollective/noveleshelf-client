
import { useState, useEffect } from 'react'

import './home.css'

const JSON_API = `${import.meta.env.VITE_JSON_API}/featured.json`

export default function Featured() {

    const [featured, setFeatured] = useState([])
    const [jsonError, setJsonError] = useState(null)

    useEffect(() => {
        fetch(JSON_API)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                console.log('data', data)
                const activeFeatured = data.filter((d) => d.is_active)
                setFeatured(activeFeatured)
            })
            .catch((err) => {
                setJsonError(err.message)
            })
    }, [])

    if (jsonError) {
        return <p>Error loading services: {jsonError}</p>;
    }

    console.log("featured", featured)

    return(
        <div className="main_featured_container">
            <h2>Featured Books</h2>
            <p>Handpicked selections from our collection</p>
            <div className="featured_container">
                {featured.map((feature) => {
                    return (
                        <div className="feature" key={feature.id}>
                            {feature.book_title}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}