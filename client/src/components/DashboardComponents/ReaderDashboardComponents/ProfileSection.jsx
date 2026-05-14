import { Link } from 'react-router-dom'
import { getMediaUrl } from '../../../utils/mediaUrl'
import './readerDash.css'

const MEDIA_URL = import.meta.env.VITE_DB_MEDIA

export default function ProfileSection({user, currentProfile, fullName}) {
    const avatarUrl = getMediaUrl(currentProfile?.avatar_url)

    return(
        <div className='profile'>
            <img src={avatarUrl} alt="Avatar" className='avatar' />
            <ul>
                <li>Name: {fullName || <em>Not Set</em>} </li>
                <li>Email: {user.email}</li>
                <li>Reader UserName: {currentProfile?.username || <em>Not set</em>}</li>
            </ul>
            <Link to="/profile-update">Update Profile</Link>
        </div>
    )
}