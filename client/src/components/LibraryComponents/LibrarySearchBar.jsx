import { Search, X } from 'lucide-react'

export default function LibrarySearchBar({ value, onChange, onFilterClick, activeFilterCount }) {
    return (
        <div className='library-search-row'>
            <div className='library-search-bar'>
                <Search size={18} className='library-search-icon' />
                <input
                    type='text'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder='Search books, authors...'
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