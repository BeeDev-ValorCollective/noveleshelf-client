import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import useAuthorBooks from '../../hooks/useAuthorBooks'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import StatsBar from '../../components/DashboardComponents/AuthorDashboardComponents/StatsBar'
import CurrentProjects from '../../components/DashboardComponents/AuthorDashboardComponents/CurrentProjects'
import PublishedWorks from '../../components/DashboardComponents/AuthorDashboardComponents/PublishedWorks'
import FinishedBooks from '../../components/DashboardComponents/AuthorDashboardComponents/FinishedBooks'
import ComingSoon from '../../components/BaseComponents/ComingSoon'
import '../../components/DashboardComponents/AuthorDashboardComponents/authorDashboard.css'


export default function AuthorDashboard() {
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const {
        currentProjects,
        publishedBooks,
        finishedBooks,
        draftBooks,
        pendingBooks,
        changesRequestedBooks,
        loading
    } = useAuthorBooks()

    const fullName = useFullName()

    if (!user) return <p>Loading...</p>


    return (
        <div className='author-dashboard-container'>
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <StatsBar booksPublished={publishedBooks.length} booksInProgress={draftBooks.length + pendingBooks.length + changesRequestedBooks.length} />
            <CurrentProjects books={currentProjects.slice(0, 5)} />
            <PublishedWorks books={publishedBooks.slice(0, 5)} />
            <FinishedBooks books={finishedBooks.slice(0, 5)} />
            {/* <ReaderFeedback /> */}
            {/* <AnalyticsOverview /> */}
            {/* <AuthorSettings /> */}
            <ComingSoon title='Reader Feedback' />
            <ComingSoon title='Analytics' />
            <ComingSoon title='Author Settings' />
        </div>
    )
}