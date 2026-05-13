import { getMediaUrl } from '../../utils/mediaUrl'
import { toTitleCase } from '../../utils/upperCase'
import { Link } from 'react-router-dom'

import './authorDashboard.css'


export default function ProfileHeader({user, currentProfile, fullName, currentRole}) {
    const avatarUrl = getMediaUrl(currentProfile?.avatar_url)


    return (
        <section className='dashboard-section profile-header'>
            <div className='profile-header-content'>
                <div className='profile-header-left'>
                    <div className='profile-avatar-container'>
                        <img
                            src={avatarUrl}
                            alt='Author Avatar'
                            className='profile-avatar'
                        />
                    </div>
                    <div className='profile-info'>
                        <h1 className='profile-name'>{fullName}</h1>
                        <p className='profile-username'>{currentProfile?.author_username || <em>Username not set</em>}</p>
                        <p className='profile-username'>{currentProfile?.pen_name || <em>Pen-name not set</em>}</p>
                        <div className='profile-badges'>
                            <span className='badge badge-author'>Default Login Role: {toTitleCase(user.default_login_role)}</span>
                            <span className='badge badge-author'>Current Role: {toTitleCase(currentRole)}</span>
                            <span className='badge badge-pro'>Paid Author</span>
                        </div>
                        <p className='profile-bio'>{currentProfile?.bio || <em>No Bio</em>}</p>
                    </div>
                </div>
                <div className='profile-header-right'>
                    <button className='edit-profile-btn'><Link to="/profile-update">Update Profile</Link></button>
                    {/* <button className='settings-btn'>⚙</button> */}
                </div>
            </div>
        </section>
    )
}