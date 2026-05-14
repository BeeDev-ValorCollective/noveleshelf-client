import './authorDashboard.css'

const reviews = [
    {
        book: 'The Silent Witness',
        text: 'An absolutely gripping thriller that kept me turning pages late into the night. The character development is masterful and the plot twists are perfectly executed.',
        rating: 5,
        time: '2 days ago'
    },
    {
        book: 'Beyond the Horizon',
        text: 'A beautifully written exploration of human resilience. Jonathan Rivers has crafted a story that resonates deeply and stays with you long after the final page.',
        rating: 5,
        time: '1 week ago'
    },
    {
        book: 'Fractured Memories',
        text: 'Compelling narrative with complex characters. The psychological depth makes this more than just a thriller - it becomes a profound character study.',
        rating: 4,
        time: '3 days ago'
    },
]

export default function ReaderFeedback() {
    return (
        <section className='dashboard-section reader-feedback'>
            <h2 className='section-heading'>Recent Reader Feedback</h2>
            <p className='section-subheading'>What readers are saying</p>
            <div className='reviews-list'>
                {reviews.map((review, index) => (
                    <div className='review-card dashboard-card'>
                        <div className='review-book-cover-placeholder'></div>
                        <div className='review-content'>
                            <h3 className='review-book-title'>{review.book}</h3>
                            <p className='review-text'>{review.text}</p>
                            <div className='review-footer'>
                                <span className='review-rating'>{'⭐'.repeat(review.rating)}</span>
                                <span className='review-time'>{review.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}