import BookPageCard from './BookPageCard'

const PAGE_TYPE_LABELS = {
    dedication: 'Dedication',
    acknowledgements: 'Acknowledgements',
    authors_note: "Author's Note",
    prologue: 'Prologue',
    next_book_teaser: 'Next Book Teaser',
}

const PAGE_TYPES = Object.keys(PAGE_TYPE_LABELS)

export default function BookPages({ book, authorType, accessToken, onBookUpdated, navigate, bookId }) {
    const getPage = (type) => book.pages?.find(p => p.page_type === type)

    return (
        <section className='manage-book-section'>
            <p className='section-note'>
                Add optional pages to your book — these are always free for readers. They'll appear in this fixed order when readers open your book:
            </p>
            <ol className='page-order-guide'>
                <li>Dedication</li>
                <li>Acknowledgements</li>
                <li>Author's Note</li>
                <li>Prologue</li>
                <li><strong>Your chapters</strong>- in chapter order</li>
                <li>Next Book Teaser</li>
            </ol>
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