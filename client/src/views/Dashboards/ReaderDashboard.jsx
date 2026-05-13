import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import ProfileHeader from '../../components/DashboardComponents/AuthorDashboardComponents/ProfileHeader'
import ProfileSection from '../../components/DashboardComponents/ReaderDashboardComponents/ProfileSection'


export default function ReaderDashboard() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()
    
    console.log('THE USER', user, 'CURRENT PROFILE', currentProfile, 'CURRENT ROLE', currentRole)

    return(
        <>
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} />
            <ProfileSection user={user} currentProfile={currentProfile} fullName={fullName} />
        </>
    )
}