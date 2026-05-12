import './authorDashboard.css'

const books = [
    { title: 'The Silent Witness', rating: 4.8, readers: '11.2K', earnings: '$2,840mo' },
    { title: 'Fractured Memories', rating: 4.6, readers: '8.9K', earnings: '$1,840mo' },
    { title: 'Beyond the Horizon', rating: 4.5, readers: '11.2K', earnings: '$2,190mo' },
    { title: 'Shadows of Truth', rating: 4.5, readers: '9.6K', earnings: '$1,960mo' },
]

export default function PublishedWorks() {
    return (
        <section className='dashboard-section published-works'>
            <h2 className='section-heading'>Published Works</h2>
            <p className='section-subheading'>Your literary collection</p>
            <div className='books-grid'>
                {books.map((book, index) => (
                    <div key={index} className='book-card dashboard-card'>
                        <div className='book-cover-placeholder'></div>
                        <h3 className='book-title'>{book.title}</h3>
                        <p className='book-rating'>⭐ {book.rating} · {book.readers} readers</p>
                        <p className='book-earnings'>{book.earnings}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}