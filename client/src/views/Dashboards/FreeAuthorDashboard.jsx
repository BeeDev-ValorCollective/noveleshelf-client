import ProfileHeader from "../../components/DashboardComponents/ProfileHeader"
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'
import FreeAuthorProjects from "../../components/DashboardComponents/FreeAuthorDashboardComponents/FreeAuthorProjects"
import PublishedWorks from '../../components/DashboardComponents/AuthorDashboardComponents/PublishedWorks'
import FinishedBooks from '../../components/DashboardComponents/AuthorDashboardComponents/FinishedBooks'
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
            currentProjects,
            publishedBooks,
            finishedBooks,
            draftBooks,
            pendingBooks,
            changesRequestedBooks,
            loading
        } = useAuthorBooks()


    return(
        <div className="free-author-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <StatsBar booksPublished={publishedBooks.length} booksInProgress={draftBooks.length + pendingBooks.length + changesRequestedBooks.length} />
            <FreeAuthorProjects books={currentProjects.slice(0, 5)} />
            <PublishedWorks books={publishedBooks.slice(0, 5)} />
            <FinishedBooks books={finishedBooks.slice(0, 5)} />
            <ComingSoon title="More tools are on the way." description="We're building out your author toolkit — check back soon." />
        </div>
    )
}