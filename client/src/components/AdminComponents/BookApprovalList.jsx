import { BOOK_STATUS_LABELS } from '../../utils/constants'
import { resolveApiAuthorDisplay } from '../../utils/display'
import Button from '../ui/Button'

const STATUS_OPTIONS = [
    'pending_approval',
    'approved',
    'changes_requested',
    'rejected',
    'draft',
]

export default function BookApprovalList({ books, selectedBook, onSelect, page, totalPages, onPageChange, statusFilter, onStatusFilter }) {
    return (
        <div className='admin-list'>
            <div className='admin-filters'>
                <select
                    value={statusFilter}
                    onChange={(e) => { onStatusFilter(e.target.value); onPageChange(1) }}
                    className='bff-select'
                >
                    <option value=''>All statuses</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{BOOK_STATUS_LABELS[s] || s}</option>
                    ))}
                </select>
            </div>

            {books.length === 0 && (
                <p className='section-note'>No books found.</p>
            )}

            {books.length > 0 && (
                <table className='pending-table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Rating</th>
                            <th>Chapters</th>
                            <th>Submitted</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => {
                            const { name, identifier } = resolveApiAuthorDisplay(book.author)
                            return (
                                <tr
                                    key={book.id}
                                    onClick={() => onSelect(book)}
                                    className={`admin-list-row ${selectedBook?.id === book.id ? 'active' : ''}`}
                                >
                                    <td>
                                        {book.title}
                                        {book.has_pending_changes && (
                                            <span className='pending-item-badge'>Has changes</span>
                                        )}
                                    </td>
                                    <td>
                                        <span>{name}</span>
                                        <span className='admin-subtext'>{identifier}</span>
                                    </td>
                                    <td>{book.content_rating?.code || 'NR'}</td>
                                    <td>{book.chapter_count}</td>
                                    <td>{book.submitted_at ? new Date(book.submitted_at).toLocaleDateString() : '—'}</td>
                                    <td>
                                        <span className={`project-status ${book.status}`}>
                                            {BOOK_STATUS_LABELS[book.status] || book.status}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}

            {totalPages > 1 && (
                <div className='admin-pagination'>
                    <Button
                        variant='secondary'
                        size='md'
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        ← Prev
                    </Button>
                    <span>Page {page} of {totalPages}</span>
                    <Button
                        variant='secondary'
                        size='md'
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    )
}