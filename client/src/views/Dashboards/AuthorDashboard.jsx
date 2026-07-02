import { Navigate } from 'react-router-dom'

import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import useAuthorBooks from '../../hooks/useAuthorBooks'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'
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
    if (!currentProfile?.author_username) return <Navigate to='/set-author-username' replace />


    return (
        <div className='author-dashboard-container'>
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <StatsBar booksPublished={publishedBooks.length} booksInProgress={draftBooks.length + pendingBooks.length + changesRequestedBooks.length} />
            <CurrentProjects books={currentProjects.slice(0, 5)} />
            <PublishedWorks books={publishedBooks.slice(0, 5)} />
            <FinishedBooks books={finishedBooks.slice(0, 5)} />
            {/* <ReaderFeedback /> */}
            {/* <AnalyticsOverview /> */}
            {/* <AuthorSettings /> */}
            <ComingSoon title="More tools are on the way." description="We're building out your author toolkit — check back soon." />
        </div>
    )
}