import AuthorUpgradeSection from '../DashboardComponents/AuthorUpgradeSection'

export default function ForAuthorsUpgradeSection({ onLoginClick }) {
    return (
        <section className='for-authors-upgrade-section'>
            <h2 className='for-authors-upgrade-title'>Ready to Share Your Story?</h2>
            <p className='for-authors-upgrade-subtitle'>
                Join hundreds of authors already publishing on Novel eShelf
            </p>
            
            <AuthorUpgradeSection onLoginClick={onLoginClick} />
        </section>
    )
}