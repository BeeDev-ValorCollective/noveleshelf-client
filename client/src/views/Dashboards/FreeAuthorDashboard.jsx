import { Navigate } from 'react-router-dom'

import ProfileHeader from "../../components/DashboardComponents/ProfileHeader"
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'
import PublishedWorks from '../../components/DashboardComponents/FreeAuthorDashboardComponents/PublishedWorks'
import FinishedBooks from '../../components/DashboardComponents/FreeAuthorDashboardComponents/FinishedBooks'
import StatsBar from "../../components/DashboardComponents/FreeAuthorDashboardComponents/StatsBar"
import ComingSoon from '../../components/BaseComponents/ComingSoon'
import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import useAuthorBooks from '../../hooks/useAuthorBooks'

export default function FreeAuthorDashboard() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const fullName = useFullName()

    const {
            publishedBooks,
            finishedBooks,
            draftBooks,
            pendingBooks,
            changesRequestedBooks,
            loading
        } = useAuthorBooks()

    if (!user) return <p>Loading...</p>
    if (!currentProfile?.author_username) return <Navigate to='/set-author-username' replace />


    return(
        <div className="free-author-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <StatsBar booksPublished={publishedBooks.length} booksInProgress={draftBooks.length + pendingBooks.length + changesRequestedBooks.length} />
            {/* <FreeAuthorProjects books={currentProjects.slice(0, 5)} /> */}
            <PublishedWorks books={publishedBooks.slice(0, 5)} />
            <FinishedBooks books={finishedBooks.slice(0, 5)} />
            <ComingSoon title="More tools are on the way." description="We're building out your author toolkit — check back soon." />
        </div>
    )
}