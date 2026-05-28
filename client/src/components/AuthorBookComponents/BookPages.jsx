import BookPageCard from './BookPageCard'

const PAGE_TYPE_LABELS = {
    prologue: 'Prologue',
    authors_note: "Author's Note",
    dedication: 'Dedication',
    acknowledgements: 'Acknowledgements',
    next_book_teaser: 'Next Book Teaser',
}

const PAGE_TYPES = Object.keys(PAGE_TYPE_LABELS)

export default function BookPages({ book, authorType, accessToken, onBookUpdated, navigate, bookId }) {
    const getPage = (type) => book.pages?.find(p => p.page_type === type)

    return (
        <section className='manage-book-section'>
            <p className='section-note'>
                Add optional pages to your book — prologue, dedication, author's note and more. These are always free for readers.
            </p>
            <div className='book-pages-list'>
                {PAGE_TYPES.map(type => (
                    <BookPageCard
                        key={type}
                        type={type}
                        label={PAGE_TYPE_LABELS[type]}
                        page={getPage(type)}
                        book={book}
                        authorType={authorType}
                        accessToken={accessToken}
                        onBookUpdated={onBookUpdated}
                        navigate={navigate}
                        bookId={bookId}
                    />
                ))}
            </div>
        </section>
    )
}