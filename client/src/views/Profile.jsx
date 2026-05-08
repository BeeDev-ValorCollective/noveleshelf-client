import useUser from '../hooks/useUser'
import useFullName from '../hooks/useFullName'
import useAuthStore from '../store/authStore'
import { Link } from 'react-router-dom'

export default function Profile() {

    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()

    console.log('THE USER', user, 'CURRENT PROFILE', currentProfile)

    switch(currentRole) {
            case 'admin':
                return(
                    <>
                    {user.email}
                    </>
                )
            case 'moderator':
                return(
                    <>
                    {user.email}
                    </>
                ) 
            case 'author':
                return(
                    <>
                    {user.email}
                    </>
                ) 
            case 'free_author':
                return(
                    <>
                    {user.email}
                    </>
                ) 
            default:
                return(
                    <div>
                        <ul>
                            <li>Email: {user.email}</li>
                            <li>Reader UserName: {currentProfile?.username || <em>Not set</em>}</li>
                            <li>Name: {fullName || <em>Not Set</em>} </li>
                            <Link to="/profile-update">Update Profile</Link>
                        </ul>
                    </div>
                ) 
        }
}