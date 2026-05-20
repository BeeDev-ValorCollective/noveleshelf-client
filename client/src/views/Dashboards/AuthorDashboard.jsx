import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import useAuthorBooks from '../../hooks/useAuthorBooks'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import StatsBar from '../../components/DashboardComponents/AuthorDashboardComponents/StatsBar'
import CurrentProjects from '../../components/DashboardComponents/AuthorDashboardComponents/CurrentProjects'
import PublishedWorks from '../../components/DashboardComponents/AuthorDashboardComponents/PublishedWorks'
import AnalyticsOverview from '../../components/DashboardComponents/AuthorDashboardComponents/AnalyticsOverview'
import ReaderFeedback from '../../components/DashboardComponents/AuthorDashboardComponents/ReaderFeedback'
import AuthorSettings from '../../components/DashboardComponents/AuthorDashboardComponents/AuthorSettings'
import ComingSoon from '../../components/BaseComponents/ComingSoon'
import '../../components/DashboardComponents/AuthorDashboardComponents/authorDashboard.css'

export default function AuthorDashboard() {
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const { books, publishedBooks, draftBooks, pendingBooks, changesRequestedBooks, loading } = useAuthorBooks()

    if (!user) return <p>Loading...</p>

    const fullName = useFullName()

    console.log("AUTHOR DASH PROPS:", books)


    return (
        <div className='author-dashboard-container'>
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <StatsBar booksPublished={publishedBooks.length} booksInProgress={draftBooks.length + pendingBooks.length + changesRequestedBooks.length} />
            <CurrentProjects books={[...draftBooks, ...pendingBooks, ...changesRequestedBooks]} />
            <PublishedWorks books={publishedBooks} />
            {/* <ReaderFeedback /> */}
            {/* <AnalyticsOverview /> */}
            {/* <AuthorSettings /> */}
            <ComingSoon title='Reader Feedback' />
            <ComingSoon title='Analytics' />
            <ComingSoon title='Author Settings' />
        </div>
    )
}