import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS, getMediaUrl } from '../../utils/api'
import LibraryBookModal from '../../components/LibraryComponents/LibraryBookModal'
import LibraryEmptyState from '../../components/LibraryComponents/LibraryEmptyState'
import LibrarySearchBar from '../../components/LibraryComponents/LibrarySearchBar'
import LibraryFilterPanel from '../../components/LibraryComponents/LibraryFilterPanel'
import '../../components/LibraryComponents/library.css'
import '../../components/LibraryComponents/library-search.css'

const EMPTY_FILTERS = {
    genre: null,
    content_rating: null,
    relationship_tag: null,
    keyword: null,
    is_new: false,
    is_complete: false,
    is_featured: false,
}

export default function Library() {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedBook, setSelectedBook] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [referenceData, setReferenceData] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({ ...EMPTY_FILTERS })
    const [pendingFilters, setPendingFilters] = useState({ ...EMPTY_FILTERS })
    const [filterPanelOpen, setFilterPanelOpen] = useState(false)

    const buildQueryString = (pageNum, query, filters) => {
        const params = new URLSearchParams()
        params.append('page', pageNum)
        if (query) params.append('search', query)
        if (filters.genre) params.append('genre', filters.genre)
        if (filters.content_rating) params.append('content_rating', filters.content_rating)
        if (filters.relationship_tag) params.append('relationship_tag', filters.relationship_tag)
        if (filters.keyword) params.append('keyword', filters.keyword)
        if (filters.is_new) params.append('is_new', 'true')
        if (filters.is_complete) params.append('is_complete', 'true')
        if (filters.is_featured) params.append('is_featured', 'true')
        return params.toString()
    }

    const fetchBooks = async (pageNum, query, filters, append = false) => {
        setIsLoading(true)
        setError(null)
        try {
            const qs = buildQueryString(pageNum, query, filters)
            const res = await fetch(`${DB_API}${ENDPOINTS.library}?${qs}`)
            const data = await res.json()
            if (res.ok) {
                setBooks((prev) => (append ? [...prev, ...data.results] : data.results))
                setTotalPages(data.total_pages)
                setPage(pageNum)
            } else {
                setError(data.error || 'Could not load books.')
            }
        } catch {
            setError('Unable to connect. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReferenceData = async () => {
        try {
            const res = await fetch(`${DB_API}${ENDPOINTS.referenceData}`)
            const data = await res.json()
            setReferenceData(data)
        } catch {
            // Filter options just won't populate; search and the grid still work.
        }
    }

    useEffect(() => {
        document.querySelector('main')?.classList.add('main--full-width')
        return () => document.querySelector('main')?.classList.remove('main--full-width')
    }, [])

    useEffect(() => {
        fetchReferenceData()
        fetchBooks(1, '', EMPTY_FILTERS)
    }, [])

    const handleSearchChange = (value) => {
        setSearchQuery(value)
        fetchBooks(1, value, activeFilters)
    }

    const handleApplyFilters = () => {
        setActiveFilters(pendingFilters)
        setFilterPanelOpen(false)
        fetchBooks(1, searchQuery, pendingFilters)
    }

    const handleClearFilters = () => {
        setPendingFilters({ ...EMPTY_FILTERS })
        setActiveFilters({ ...EMPTY_FILTERS })
        setFilterPanelOpen(false)
        fetchBooks(1, searchQuery, EMPTY_FILTERS)
    }

    const handleLoadMore = () => {
        fetchBooks(page + 1, searchQuery, activeFilters, true)
    }

    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

    if (isLoading && page === 1 && books.length === 0) return <LibraryEmptyState loading />
    if (error) return <p className='library-error'>{error}</p>

    return (
        <div className='library-page'>
            <div className='library-header'>
                <div className='library-header-text'>
                    <h1>The Library</h1>
                    <p>Discover stories waiting to be read</p>
                </div>

                <LibrarySearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFilterClick={() => {
                        setPendingFilters({ ...activeFilters })
                        setFilterPanelOpen(true)
                    }}
                    activeFilterCount={activeFilterCount}
                />
            </div>

            {!isLoading && books.length === 0 ? (
                <LibraryEmptyState />
            ) : (
                <>
                    <ul className='book-grid'>
                        {books.map((book) => (
                            <li key={book.id} onClick={() => setSelectedBook(book)}>
                                <img src={getMediaUrl(book.cover_image)} alt={book.title} />
                                <span className='bookTitle'>{book.title}</span>
                                {book.is_complete && (
                                    <span className='book-complete-badge'>✓ Complete</span>
                                )}
                            </li>
                        ))}
                    </ul>

                    {page < totalPages && (
                        <div className='library-load-more'>
                            <button onClick={handleLoadMore} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {filterPanelOpen && (
                <LibraryFilterPanel
                    referenceData={referenceData}
                    pendingFilters={pendingFilters}
                    setPendingFilters={setPendingFilters}
                    onApply={handleApplyFilters}
                    onClose={() => setFilterPanelOpen(false)}
                    onClear={handleClearFilters}
                />
            )}

            {selectedBook && (
                <LibraryBookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </div>
    )
}