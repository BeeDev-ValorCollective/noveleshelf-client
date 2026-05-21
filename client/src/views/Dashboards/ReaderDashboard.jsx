import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import RenderStatsBar from '../../components/DashboardComponents/ReaderDashboardComponents/StatsBar.jsx';
import CurrentlyReading from '../../components/DashboardComponents/ReaderDashboardComponents/CurrentlyReading.jsx';
import SavedBooks from '../../components/DashboardComponents/ReaderDashboardComponents/SavedBooks.jsx';
import FinishedBooks from '../../components/DashboardComponents/ReaderDashboardComponents/FinishedBooks.jsx';
import ReadingActivity from '../../components/DashboardComponents/ReaderDashboardComponents/ReadingActivity.jsx';
import ReadingPreferences from '../../components/DashboardComponents/ReaderDashboardComponents/ReadingPreferences.jsx';

import '../../components/DashboardComponents/ReaderDashboardComponents/readerDashboard.css';


export default function ReaderDashboard() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()

    return(
        <div  className="reader-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <RenderStatsBar />
            <CurrentlyReading />
            <SavedBooks />
            <FinishedBooks />
            <ReadingActivity />
            <ReadingPreferences />
        </div>

    )
}