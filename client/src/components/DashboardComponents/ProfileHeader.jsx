import { getMediaUrl } from '../../utils/api'
import { toTitleCase } from '../../utils/upperCase'
import { Link } from 'react-router-dom'

import './dashboard.css'


export default function ProfileHeader({ user, currentProfile, fullName, currentRole }) {
    const avatarUrl = getMediaUrl(currentProfile?.avatar_url)

    const displayRole = currentRole || localStorage.getItem('current_role')

    if (import.meta.env.DEV) {
        console.log('ProfileHeader props:', { currentRole, currentProfile, user }, 'DisplayRole:', displayRole)
    }


    return (
        <section className='dashboard-section profile-header'>
            <div className='profile-header-content'>
                <div className='profile-header-left'>
                    <div className='profile-avatar-container'>
                        <img
                            src={avatarUrl}
                            alt='Avatar'
                            className='profile-avatar'
                        />
                    </div>
                    <div className='profile-info'>
                        <h1 className='profile-name'>{fullName}</h1>
                        <p className='profile-username'>{currentProfile?.username || <em>Username not set</em>}</p>

                        {currentProfile?.pen_name !== undefined && (
                            <p className='profile-username'>{currentProfile.pen_name || <em>Pen-name not set</em>}</p>
                        )}

                        <div className='profile-badges'>
                            <span className='badge badge-author'>Default Login Role: {toTitleCase(user.default_login_role)}</span>
                            <span className='badge badge-author'>Current Role: {toTitleCase(currentRole)}</span>
                            {['author', 'free_author'].includes(currentRole) && (
                                <span className='badge badge-pro'>
                                    {currentRole === 'author' ? 'Paid Author' : 'Free Author'}
                                </span>
                            )}
                            {currentRole === 'author' && currentProfile?.founding_author && (
                                <span className='badge badge-founding'>⭐ Founding Author</span>
                            )}
                        </div>

                        {currentProfile?.bio !== undefined && (
                            <p className='profile-bio'>{currentProfile.bio || <em>No Bio Written</em>}</p>
                        )}
                        {currentRole === 'author' && (
                            <p className='profile-contract'>
                                {currentProfile?.contract_link
                                    ? <a href={currentProfile.contract_link} target='_blank' rel='noopener noreferrer'>View your contract →</a>
                                    : <em>Your contract link will appear here once added by admin.</em>
                                }
                            </p>
                        )}
                    </div>
                </div>
                <div className='profile-header-right'>
                    <button className='edit-profile-btn'><Link to="/profile-update">Update Profile</Link></button>
                </div>
            </div>
        </section>
    )
}