import useUser from "../../hooks/useUser";
import useAuthStore from '../../store/authStore'

import UpdateReaderProfile from '../../components/ProfileComponents/UpdateReaderProfile'
import UpdateAuthorProfile from "../../components/ProfileComponents/UpdateAuthorProfile"
import UpdateFreeAuthorProfile from "../../components/ProfileComponents/UpdateFreeAuthorProfile"
import UpdateModeratorProfile from '../../components/ProfileComponents/UpdateModeratorProfile'
import UpdateAdminProfile from '../../components/ProfileComponents/UpdateAdminProfile'

export default function UpdateProfile() {

    const { user } = useUser()
    const currentRole = useAuthStore((state) => state.currentRole)

    if (!user) return <p>Loading...</p>

    switch(currentRole) {
        case 'admin':
            return <UpdateAdminProfile />
        case 'moderator':
            return <UpdateModeratorProfile />
        case 'author':
            return <UpdateAuthorProfile />
        case 'free_author':
            return <UpdateFreeAuthorProfile />
        default:
            return <UpdateReaderProfile />
    }
}