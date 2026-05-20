import ProfileHeader from "../../components/DashboardComponents/ProfileHeader";
import FreeAuthorProjects from "../../components/DashboardComponents/FreeAuthorDashboardComponents/FreeAuthorProjects";
import StatsBar from "../../components/DashboardComponents/FreeAuthorDashboardComponents/StatsBar";
import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

export default function FreeAuthorDashboard() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const fullName = useFullName()


    return(
        <div className="free-author-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <StatsBar />
            <FreeAuthorProjects />
        </div>
    )
}