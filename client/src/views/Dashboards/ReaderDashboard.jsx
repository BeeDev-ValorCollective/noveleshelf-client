import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'

import ProfileSection from '../../components/ReaderDashboardComponents/ProfileSection'


export default function ReaderDashboard() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()
    
    console.log('THE USER', user, 'CURRENT PROFILE', currentProfile)

    return(
        <>
            <ProfileSection user={user} currentProfile={currentProfile} fullName={fullName} />
        </>
    )
}