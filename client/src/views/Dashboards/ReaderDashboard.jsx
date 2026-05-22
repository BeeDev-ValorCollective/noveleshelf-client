import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'

import ComingSoon from '../../components/BaseComponents/ComingSoon'

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
            {/* <RenderStatsBar /> */}
            {/* <CurrentlyReading /> */}
            {/* <SavedBooks /> */}
            {/* <FinishedBooks /> */}
            {/* <ReadingActivity /> */}
            {/* <ReadingPreferences /> */}
            <ComingSoon title='Reader Stats' description='This section is coming soon. Check back after launch!' />
            <ComingSoon title='Currently Reading' />
            <ComingSoon title='Saved Books' />
            <ComingSoon title='Finished Books' />
            <ComingSoon title='Reading Activity' />
            <ComingSoon title='Preferences' />
        </div>

    )
}