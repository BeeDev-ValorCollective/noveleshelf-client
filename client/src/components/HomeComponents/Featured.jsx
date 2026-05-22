import { useState, useEffect } from 'react'
import { getMediaUrl } from '../../utils/api'
import './home.css'
import { DB_API, ENDPOINTS } from '../../utils/api'

export default function Featured() {
    const [featuredBooks, setFeaturedBooks] = useState([])
    const [featuredAuthors, setFeaturedAuthors] = useState([])
    const [loading, setLoading] = useState(true)
    const [jsonError, setJsonError] = useState(null)

    useEffect(() => {
        fetch(`${DB_API}${ENDPOINTS.featured}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((data) => {
                setFeaturedBooks(data.featured_books || [])
                setFeaturedAuthors(data.featured_authors || [])
            })
            .catch((err) => {
                setJsonError(err.message)
            })
            .finally(() => setLoading(false))
    }, [])

    if (jsonError) return <p>Error loading featured content: {jsonError}</p>
    if (loading) return <p>Loading...</p>

    return (
        <div className="main_featured_container">
            <div className="featured_books_section">
                <h2>Featured Books</h2>
                <p>Handpicked selections from our collection</p>
                {featuredBooks.length === 0 ? (
                    <p className="featured_empty">Check back soon for featured books!</p>
                ) : (
                    <div className="featured_container">
                        {featuredBooks.map((book) => (
                            
                            <div className="feature" key={book.id}>
                                <img src={getMediaUrl(book.cover_image)} alt={book.title} className='featured-book-cover'/>
                                <h3>{book.title}</h3>
                                <p>{book.author?.display_name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="featured_authors_section">
                <h2>Featured Authors</h2>
                <p>Meet the voices behind the stories</p>
                {featuredAuthors.length === 0 ? (
                    <p className="featured_empty">Check back soon for featured authors!</p>
                ) : (
                    <div className="featured_container">
                        {featuredAuthors.map((author, index) => (
                            <div className="feature" key={index}>
                                <img src={getMediaUrl(author.avatar_url)} alt={author.display_name} />
                                <h3>{author.display_name}</h3>
                                <p>{author.book_count} {author.book_count === 1 ? 'book' : 'books'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}