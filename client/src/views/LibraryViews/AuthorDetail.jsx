import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { DB_API, ENDPOINTS } from '../../utils/api'
import AuthorDetailHero from '../../components/LibraryComponents/Author/AuthorDetailHero'
import AuthorDetailBooks from '../../components/LibraryComponents/Author/AuthorDetailBooks'
import '../../components/LibraryComponents/Author/authordetail.css'

export default function AuthorDetail() {
    // 1. Destructure authorUsername to match the exact key specified in App.jsx
    const { authorUsername } = useParams() 
    const navigate = useNavigate()
    const location = useLocation()
    const [author, setAuthor] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const backTo = location.state?.backTo || '/library'
    const backLabel = '← Back'

    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                // 2. Pass authorUsername into your endpoint mapping method
                const res = await fetch(`${DB_API}${ENDPOINTS.publicAuthorDetail(authorUsername)}`)
                
                if (res.status === 404) {
                    setError('not_found')
                    return
                }
                if (!res.ok) {
                    setError('server')
                    return
                }
                const data = await res.json()

                console.log("SERVER PAYLOAD:", data)

                
                setAuthor(data)
            } catch {
                setError('network')
            } finally {
                setIsLoading(false)
            }
        }
        
        // 3. Trigger the effect when the username in the URL bar changes
        fetchAuthorData()
    }, [authorUsername]) 

    if (isLoading) return <div className='bd-page'><div className='bd-loading'>Loading profile details…</div></div>
    if (error) {
        return (
            <div className='bd-page'>
                <div className='bd-error'>
                    <p>{error === 'not_found' ? 'This author could not be found.' : 'Something went wrong.'}</p>
                    <button className='bd-back-btn' onClick={() => navigate(backTo)}>{backLabel}</button>
                </div>
            </div>
        )
    }

    return (
        <div className='bd-page'>
            <div className='bd-inner'>
                <button className='bd-back-btn' onClick={() => navigate(backTo)}>
                    {backLabel}
                </button>
                
                {/* 2. Replace the test divs with your modular components */}
                <AuthorDetailHero author={author} />
                
                {/* Adjust 'author.books' based on how your Django serializer structures its nested data payload */}
                <AuthorDetailBooks books={author.books} authorName={author.display_name} />
            </div>
        </div>
    )
}