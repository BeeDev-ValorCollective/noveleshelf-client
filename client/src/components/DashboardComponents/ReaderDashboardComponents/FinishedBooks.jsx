import './readerDashboard.css';

const finishedBooks = [
    { title: 'Impetigo', author: 'Sara Mitchell', rating: 4.5, genre: 'fiction' },
    { title: 'Summer Solstice', author: 'James Crawford', rating: 4.8, genre: 'mystery' },
    { title: 'Winter Wonderland', author: 'Emma Thompson', rating: 4.2, genre: 'drama' },
    { title: 'Shades of Cool', author: 'Lana Del Ray', rating: 4.6, genre: 'romance' },
]

export default function FinishedBooks() {
    return (
        <section className='reader-section'>
            <h2 className='reader-section-heading'>Finished Books</h2>
            <p className='reader-section-subheading'>Your complete library adventures</p>
            <div className='reader-books-grid'>
                {finishedBooks.map((book, index) => (
                    <div key={index} className='reader-book-card'>
                        <div className='reader-book-cover-placeholder'>
                            {book.title}
                        </div>
                        <div className='reader-book-info'>
                            <h3 className='reader-book-title'>{book.title}</h3>
                            <p className='reader-book-author'>{book.author}</p>
                            <div className='reader-book-footer'>
                                <span className='reader-book-rating'>⭐ {book.rating}</span>
                                <span className={`reader-genre-badge ${book.genre}`}>{book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}