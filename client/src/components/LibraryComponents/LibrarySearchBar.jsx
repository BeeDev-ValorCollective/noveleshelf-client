import { Search, X } from 'lucide-react'

const BOOK_ORDER_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'az', label: 'A – Z' },
    { value: 'za', label: 'Z – A' },
    { value: 'featured', label: 'Featured first' },
]

const AUTHOR_ORDER_OPTIONS = [
    { value: 'az', label: 'A – Z' },
    { value: 'za', label: 'Z – A' },
    { value: 'featured', label: 'Featured first' },
]

export default function LibrarySearchBar({
    value,
    onChange,
    onFilterClick,
    activeFilterCount,
    view,
    onViewChange,
    order,
    onOrderChange,
}) {
    const orderOptions = view === 'authors' ? AUTHOR_ORDER_OPTIONS : BOOK_ORDER_OPTIONS

    return (
        <div className='library-search-row'>
            <div className='library-view-toggle'>
                <button
                    className={`library-view-btn ${view === 'books' ? 'library-view-btn--active' : ''}`}
                    onClick={() => onViewChange('books')}
                >
                    Books
                </button>
                <button
                    className={`library-view-btn ${view === 'authors' ? 'library-view-btn--active' : ''}`}
                    onClick={() => onViewChange('authors')}
                >
                    Authors
                </button>
            </div>

            <div className='library-search-bar'>
                <Search size={18} className='library-search-icon' />
                <input
                    type='text'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={view === 'authors' ? 'Search authors...' : 'Search books, authors...'}
                    className='library-search-input'
                    autoCapitalize='none'
                />
                {value.length > 0 && (
                    <button
                        className='library-search-clear'
                        onClick={() => onChange('')}
                        aria-label='Clear search'
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <select
                className='library-order-select'
                value={order}
                onChange={(e) => onOrderChange(e.target.value)}
                aria-label='Sort order'
            >
                {orderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            <button
                className={`library-filter-btn ${activeFilterCount > 0 ? 'library-filter-btn--active' : ''}`}
                onClick={onFilterClick}
            >
                Filters
                {activeFilterCount > 0 && (
                    <span className='library-filter-count'>{activeFilterCount}</span>
                )}
            </button>
        </div>
    )
}