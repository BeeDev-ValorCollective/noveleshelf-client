import ProfileHeader from '../../components/AuthorDashboardComponents/ProfileHeader'
import StatsBar from '../../components/AuthorDashboardComponents/StatsBar'
import CurrentProjects from '../../components/AuthorDashboardComponents/CurrentProjects'
import PublishedWorks from '../../components/AuthorDashboardComponents/PublishedWorks'
import AnalyticsOverview from '../../components/AuthorDashboardComponents/AnalyticsOverview'
import ReaderFeedback from '../../components/AuthorDashboardComponents/ReaderFeedback'
import AuthorSettings from '../../components/AuthorDashboardComponents/AuthorSettings'
import '../../components/AuthorDashboardComponents/authorDashboard.css'

export default function AuthorDashboard() {
    return (
        <div className='author-dashboard-container'>
            <ProfileHeader />
            <StatsBar />
            <CurrentProjects />
            <PublishedWorks />
            <ReaderFeedback />
            <AnalyticsOverview />
            <AuthorSettings />
        </div>
    )
}