import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'

import ComingSoon from '../../components/BaseComponents/ComingSoon'

import '../../components/DashboardComponents/ReaderDashboardComponents/readerDashboard.css';



export default function ModeratorDashboard() {
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()


    return (
        <div className="reader-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <ComingSoon title="More moderation tools are coming." description="Additional tools to help keep the shelves in order are on the way." />
        </div>
    )
}