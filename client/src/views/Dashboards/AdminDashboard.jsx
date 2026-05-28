import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'

import ComingSoon from '../../components/BaseComponents/ComingSoon'

import PendingReviewsPanel from '../../components/DashboardComponents/AdminDashboardComponents/PendingReviewsPanel'

import '../../components/DashboardComponents/ReaderDashboardComponents/readerDashboard.css';


export default function AdminDashboard() {
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const accessToken = useAuthStore((state) => state.accessToken)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()


    return (
        <div className="reader-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <PendingReviewsPanel accessToken={accessToken} />
            <ComingSoon title="More admin tools are on the way." description="The platform is live — additional management features are being added." />
        </div>
    )
}