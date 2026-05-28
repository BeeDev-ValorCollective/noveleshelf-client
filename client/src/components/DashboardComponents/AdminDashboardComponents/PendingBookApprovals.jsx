export default function PendingBookApprovals({ books, isLoading, error }) {
    return (
        <div className='pending-panel'>
            <div className='pending-panel-header'>
                <h2 className='pending-panel-title'>Book Approvals</h2>
                <a href='/admin/book-approvals' className='view-all-link'>View All</a>
            </div>
            {isLoading && <p className='section-note'>Loading...</p>}
            {error && <p className='form-error'>{error}</p>}
            {!isLoading && !error && books.length === 0 && (
                <p className='section-note'>No books pending approval.</p>
            )}
            {!isLoading && !error && books.length > 0 && (
                <table className='pending-table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Rating</th>
                            <th>Chapters</th>
                            <th>Submitted</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    {book.title}
                                    {book.has_pending_changes && (
                                        <span className='pending-item-badge'>Has changes</span>
                                    )}
                                </td>
                                <td>{book.content_rating?.code || 'NR'}</td>
                                <td>{book.chapter_count}</td>
                                <td>{book.submitted_at ? new Date(book.submitted_at).toLocaleDateString() : '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}