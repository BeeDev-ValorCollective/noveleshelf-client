import useAuthStore from '../store/authStore'

export default function useDisplayName() {
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)

    if (!user || !currentProfile) return user?.email || ''

    switch(currentRole) {
        case 'author':
            // paid author - first/last name admin only, show if show_real_name
            if (currentProfile.show_real_name && currentProfile.first_name) {
                return `${currentProfile.first_name} ${currentProfile.last_name || ''}`.trim()
            }
            return currentProfile.pen_name || currentProfile.author_username || user.email

        case 'free_author':
            // free author controls their own first/last name
            if (currentProfile.show_real_name && currentProfile.first_name) {
                return `${currentProfile.first_name} ${currentProfile.last_name || ''}`.trim()
            }
            return currentProfile.pen_name || currentProfile.author_username || user.email

        case 'admin':
            return currentProfile.admin_username || user.email

        case 'moderator':
            return currentProfile.mod_username || user.email

        default:
            // reader
            if (currentProfile.first_name) {
                return `${currentProfile.first_name} ${currentProfile.last_name || ''}`.trim()
            }
            return currentProfile.username || user.email
    }
}