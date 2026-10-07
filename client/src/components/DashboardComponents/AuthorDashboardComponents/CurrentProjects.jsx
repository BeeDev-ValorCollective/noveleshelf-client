import { getMediaUrl } from '../../../utils/api'
import Button from '../../ui/Button'
import './authorDashboard.css'

export default function CurrentProjects({ books }) {
    if (!books || books.length === 0) {
        return (
            <section className='dashboard-section current-projects'>
                <div className='section-heading-row'>
                    <div>
                        <h2 className='section-heading'>Current Draft Projects</h2>
                        <p className='section-subheading'>Drafts in progress - Not searchable by users</p>
                    </div>
                    <Button
                        variant='ghost'
                        size='md'
                        href='/author/books'
                    >
                        View All
                    </Button>
                    <Button
                        variant='primary'
                        size='md'
                        href="/author/create-book"
                    >
                        Create a Book
                    </Button>
                </div>
                <p style={{ color: '#ffffffa0', textAlign: 'center' }}>No current projects</p>
            </section>
        )
    }

    return (
        <section className='dashboard-section current-projects'>
            <div className='section-heading-row'>
                <div>
                    <h2 className='section-heading'>Current Draft Projects</h2>
                    <p className='section-subheading'>Drafts in progress - Not searchable by users</p>
                </div>
                <Button
                    variant='ghost'
                    size='md'
                    href='/author/books'
                >
                    View All
                </Button>
            </div>
            <div className='projects-list'>
                {books.map((book) => (
                    <div key={book.id} className='project-card dashboard-card'>
                        <img
                            src={getMediaUrl(book.cover_image)}
                            alt={book.title}
                            className='project-cover-placeholder'
                        />
                        <div className='project-info'>
                            <h3 className='project-title'>{book.title}</h3>
                            <span className={`project-status ${book.status}`}>{book.status.replace(/_/g, ' ')}</span>
                        </div>
                        <Button
                            variant='secondary'
                            size='sm'
                            href={`/author/books/${book.id}/manage`}
                        >
                            Manage Book
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    )
}