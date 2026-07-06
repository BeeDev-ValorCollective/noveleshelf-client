import { useState, useEffect } from 'react'
import { DB_API, ENDPOINTS, getMediaUrl } from '../../utils/api'
import LibraryBookModal from '../../components/LibraryComponents/LibraryBookModal'
import LibraryEmptyState from '../../components/LibraryComponents/LibraryEmptyState'
import LibrarySearchBar from '../../components/LibraryComponents/LibrarySearchBar'
import LibraryFilterPanel from '../../components/LibraryComponents/LibraryFilterPanel'
import LibraryAuthorModal from '../../components/LibraryComponents/LibraryAuthorModal'
import '../../components/LibraryComponents/library.css'
import '../../components/LibraryComponents/library-search.css'
import '../../components/LibraryComponents/library-authors.css'

const EMPTY_BOOK_FILTERS = {
    genre: null,
    content_rating: null,
    relationship_tag: null,
    keyword: null,
    is_new: false,
    is_complete: false,
    is_featured: false,
}

const EMPTY_AUTHOR_FILTERS = {
    is_featured: false,
    is_founding_author: false,
}

const DEFAULT_ORDER = {
    books: 'newest',
    authors: 'az',
}

export default function Library() {
    const [view, setView] = useState('books')
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedBook, setSelectedBook] = useState(null)
    const [selectedAuthor, setSelectedAuthor] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [referenceData, setReferenceData] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [order, setOrder] = useState('newest')
    const [activeFilters, setActiveFilters] = useState({ ...EMPTY_BOOK_FILTERS })
    const [pendingFilters, setPendingFilters] = useState({ ...EMPTY_BOOK_FILTERS })
    const [filterPanelOpen, setFilterPanelOpen] = useState(false)

    const buildQueryString = (pageNum, query, filters, currentView, currentOrder) => {
        const params = new URLSearchParams()
        params.append('page', pageNum)
        if (currentView === 'authors') params.append('view', 'authors')
        if (currentOrder) params.append('order', currentOrder)
        if (query) params.append('search', query)

        if (currentView === 'books') {
            if (filters.genre) params.append('genre', filters.genre)
            if (filters.content_rating) params.append('content_rating', filters.content_rating)
            if (filters.relationship_tag) params.append('relationship_tag', filters.relationship_tag)
            if (filters.keyword) params.append('keyword', filters.keyword)
            if (filters.is_new) params.append('is_new', 'true')
            if (filters.is_complete) params.append('is_complete', 'true')
            if (filters.is_featured) params.append('is_featured', 'true')
        } else {
            if (filters.is_featured) params.append('is_featured', 'true')
            if (filters.is_founding_author) params.append('is_founding_author', 'true')
        }

        return params.toString()
    }

    const fetchResults = async (pageNum, query, filters, currentView, currentOrder, append = false) => {
        setIsLoading(true)
        setError(null)
        try {
            const qs = buildQueryString(pageNum, query, filters, currentView, currentOrder)
            const res = await fetch(`${DB_API}${ENDPOINTS.library}?${qs}`)
            const data = await res.json()
            if (res.ok) {
                setResults((prev) => (append ? [...prev, ...data.results] : data.results))
                setTotalPages(data.total_pages)
                setPage(pageNum)
            } else {
                setError(data.error || 'Could not load results.')
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
        fetchResults(1, '', EMPTY_BOOK_FILTERS, 'books', 'newest')
    }, [])

    const handleViewChange = (newView) => {
        if (newView === view) return
        const emptyFilters = newView === 'books' ? { ...EMPTY_BOOK_FILTERS } : { ...EMPTY_AUTHOR_FILTERS }
        const newOrder = DEFAULT_ORDER[newView]
        setResults([])
        setView(newView)
        setOrder(newOrder)
        setSearchQuery('')
        setActiveFilters(emptyFilters)
        setPendingFilters(emptyFilters)
        setFilterPanelOpen(false)
        setSelectedBook(null)
        setSelectedAuthor(null)
        fetchResults(1, '', emptyFilters, newView, newOrder)
    }

    const handleSearchChange = (value) => {
        setSearchQuery(value)
        fetchResults(1, value, activeFilters, view, order)
    }

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder)
        fetchResults(1, searchQuery, activeFilters, view, newOrder)
    }

    const handleApplyFilters = () => {
        setActiveFilters(pendingFilters)
        setFilterPanelOpen(false)
        fetchResults(1, searchQuery, pendingFilters, view, order)
    }

    const handleClearFilters = () => {
        const emptyFilters = view === 'books' ? { ...EMPTY_BOOK_FILTERS } : { ...EMPTY_AUTHOR_FILTERS }
        setPendingFilters(emptyFilters)
        setActiveFilters(emptyFilters)
        setFilterPanelOpen(false)
        fetchResults(1, searchQuery, emptyFilters, view, order)
    }

    const handleLoadMore = () => {
        fetchResults(page + 1, searchQuery, activeFilters, view, order, true)
    }

    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

    console.log('RESULTS:', results)

    if (isLoading && page === 1 && results.length === 0) return <LibraryEmptyState loading />
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
                    view={view}
                    onViewChange={handleViewChange}
                    order={order}
                    onOrderChange={handleOrderChange}
                />
            </div>

            {!isLoading && results.length === 0 ? (
                <LibraryEmptyState />
            ) : (
                <>
                    {view === 'books' ? (
                        <ul className='book-grid'>
                            {results.map((book) => (
                                <li key={book.id} onClick={() => setSelectedBook(book)}>
                                    <img src={getMediaUrl(book.cover_image)} alt={book.title} />
                                    <span className='bookTitle'>{book.title}</span>
                                    {book.is_complete && (
                                        <span className='book-complete-badge'>✓ Complete</span>
                                    )}
                                    {book.is_founding_eligible && (
                                        <span className='book-founding-star' title='Founding Author Book'>★</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className='author-grid'>
                            {results.map((author) => (
                                <li
                                    key={`${author.author_type}-${author.id}`}
                                    className='author-card'
                                    onClick={() => setSelectedAuthor(author)}
                                >
                                    <div className='author-card-avatar'>
                                        {author.avatar_url
                                            ? <img src={getMediaUrl(author.avatar_url)} alt={author.display_name} />
                                            : <div className='author-card-avatar-placeholder'>{author.display_name?.[0] ?? '?'}</div>
                                        }
                                    </div>
                                    <div className='author-card-info'>
                                        <div className='author-card-name-row'>
                                            <span className='author-card-name'>{author.display_name}</span>
                                            {author.is_founding_author && (
                                                <span className='author-founding-badge'>Founding Author</span>
                                            )}
                                        </div>
                                        {author.bio && (
                                            <p className='author-card-bio'>
                                                {author.bio.length > 120 ? author.bio.slice(0, 120) + '…' : author.bio}
                                            </p>
                                        )}
                                        <span className='author-card-book-count'>
                                            {author.book_count} {author.book_count === 1 ? 'book' : 'books'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

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
                    view={view}
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
                    backTo='/library'
                />
            )}

            {selectedAuthor && (
                <LibraryAuthorModal
                    author={selectedAuthor}
                    onClose={() => setSelectedAuthor(null)}
                />
            )}
        </div>
    )
}