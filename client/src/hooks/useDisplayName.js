import useAuthStore from '../store/authStore'
import {
    resolveAuthorName,
    resolveAdminName,
    resolveModeratorName,
    resolveReaderName,
} from '../utils/display'

export default function useDisplayName() {
    const user           = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole    = useAuthStore((state) => state.currentRole)

    if (!user || !currentProfile) return user?.email || ''

    switch (currentRole) {
        case 'author':
        case 'free_author':
            return resolveAuthorName(currentProfile, user.email)

        case 'admin':
            return resolveAdminName(currentProfile, user.email)

        case 'moderator':
            return resolveModeratorName(currentProfile, user.email)

        default:
            // reader
            return resolveReaderName(currentProfile, user.email)
    }
}