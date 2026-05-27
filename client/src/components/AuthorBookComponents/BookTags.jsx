import TagGroup from './TagGroup'

export default function BookTags({ book, authorType, accessToken, allGenres, allKeywords, allRelationshipTags, onBookUpdated }) {
    return (
        <section className='manage-book-section'>
            <h2>Genres, Keywords & Tags</h2>
            <p className='section-note'>
                Add genres, keywords, and relationship tags to help readers discover your book.
            </p>
            <section className='tags'>
                <TagGroup
                    title='Genres'
                    bookItems={book.genres}
                    allItems={allGenres}
                    itemKey='genre_id'
                    addEndpoint='books/author/books/genres/add/'
                    removeEndpoint='books/author/books/genres/remove/'
                    authorType={authorType}
                    bookId={book.id}
                    accessToken={accessToken}
                    onBookUpdated={onBookUpdated}
                    displayFn={(item) => item.name}
                />
                <TagGroup
                    title='Keywords'
                    bookItems={book.keywords}
                    allItems={allKeywords}
                    itemKey='keyword_id'
                    addEndpoint='books/author/books/keywords/add/'
                    removeEndpoint='books/author/books/keywords/remove/'
                    authorType={authorType}
                    bookId={book.id}
                    accessToken={accessToken}
                    onBookUpdated={onBookUpdated}
                    displayFn={(item) => item.name}
                />
                <TagGroup
                    title='Relationship Tags'
                    bookItems={book.relationship_tags}
                    allItems={allRelationshipTags}
                    itemKey='tag_id'
                    addEndpoint='books/author/books/relationship-tags/add/'
                    removeEndpoint='books/author/books/relationship-tags/remove/'
                    authorType={authorType}
                    bookId={book.id}
                    accessToken={accessToken}
                    onBookUpdated={onBookUpdated}
                    displayFn={(item) => `${item.code} — ${item.name}`}
                />
            </section>
        </section>
    )
}