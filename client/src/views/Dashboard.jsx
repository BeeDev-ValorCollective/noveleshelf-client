import useUser from '../hooks/useUser'
import useAuthStore from '../store/authStore'
import ReaderDashboard from '../components/DashboardComponents/ReaderDashboard'
import FreeAuthorDashboard from '../components/DashboardComponents/FreeAuthorDashboard'
import AuthorDashboard from '../components/DashboardComponents/AuthorDashboard'
import ModeratorDashboard from '../components/DashboardComponents/ModeratorDashboard'
import AdminDashboard from '../components/DashboardComponents/AdminDashboard'

export default function Dashboard() {
    const { user } = useUser()
    const currentRole = useAuthStore((state) => state.currentRole)

    if (!user) return <p>Loading...</p>

    switch(currentRole) {
        case 'admin':
            return <AdminDashboard />
        case 'moderator':
            return <ModeratorDashboard />
        case 'author':
            return <AuthorDashboard />
        case 'free_author':
            return <FreeAuthorDashboard />
        default:
            return <ReaderDashboard />
    }
}