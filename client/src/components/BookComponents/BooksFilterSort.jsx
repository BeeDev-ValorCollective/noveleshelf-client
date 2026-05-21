import { STATUS_LABELS, SORT_OPTIONS } from '../../utils/books'

export default function BooksFilterSort({ books, statusFilter, onStatusChange, sortValue, onSortChange }) {
    return (
        <div className='books-filter-sort'>
            <div className='books-filter'>
                <label htmlFor='status-filter'>Filter by status</label>
                <select
                    id='status-filter'
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value='all'>All ({books.length})</option>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => {
                        const count = books.filter((b) => b.status === value).length
                        return (
                            <option key={value} value={value}>
                                {label} ({count})
                            </option>
                        )
                    })}
                </select>
            </div>

            <div className='books-sort'>
                <label htmlFor='sort'>Sort by</label>
                <select
                    id='sort'
                    value={sortValue}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}