import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileHeader from '../../components/AuthorDashboardComponents/ProfileHeader'
import StatsBar from '../../components/AuthorDashboardComponents/StatsBar'
import CurrentProjects from '../../components/AuthorDashboardComponents/CurrentProjects'
import PublishedWorks from '../../components/AuthorDashboardComponents/PublishedWorks'
import AnalyticsOverview from '../../components/AuthorDashboardComponents/AnalyticsOverview'
import ReaderFeedback from '../../components/AuthorDashboardComponents/ReaderFeedback'
import AuthorSettings from '../../components/AuthorDashboardComponents/AuthorSettings'
import '../../components/AuthorDashboardComponents/authorDashboard.css'

export default function AuthorDashboard() {
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()


    return (
        <div className='author-dashboard-container'>
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <StatsBar />
            <CurrentProjects />
            <PublishedWorks />
            <ReaderFeedback />
            <AnalyticsOverview />
            <AuthorSettings />
        </div>
    )
}