import useUser from '../../hooks/useUser'
import useAuthStore from '../../store/authStore'
import ReaderDashboard from '../Dashboards/ReaderDashboard'
import FreeAuthorDashboard from '../Dashboards/FreeAuthorDashboard'
import AuthorDashboard from '../Dashboards/AuthorDashboard'
import ModeratorDashboard from '../Dashboards/ModeratorDashboard'
import AdminDashboard from '../Dashboards/AdminDashboard'

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