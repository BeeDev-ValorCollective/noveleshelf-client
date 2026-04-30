import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'
import { useState, useRef, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import useLogout from '../../hooks/useLogout'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '../../utils/mediaUrl'

export default function Header({ onLoginClick, onSignupClick }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const setCurrentRole = useAuthStore((state) => state.setCurrentRole)
    const { logout } = useLogout()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const avatarUrl = getMediaUrl(currentProfile?.avatar_url)

    const availableRoles = []
    if (user?.profile) availableRoles.push({ role: 'reader', label: 'Reader' })
    if (user?.free_author_profile) availableRoles.push({ role: 'free_author', label: 'Free Author' })
    if (user?.author_profile) availableRoles.push({ role: 'author', label: 'Author' })
    if (user?.moderator_profile) availableRoles.push({ role: 'moderator', label: 'Moderator' })
    if (user?.admin_profile) availableRoles.push({ role: 'admin', label: 'Admin' })

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return(
        <>
        <header>
            <div className="title">
                <img src={Shelf} alt="Novel eShelf" className="shelfImg" />
                <h1>Novel eShelf</h1>
            </div>
            <nav>
                <a href="/">Home</a>
                <a href="#">Library</a>
                <a href="/for-readers">For Readers</a>
                <a href="/for-authors">For Authors</a>
                <a href="#">Shop</a>
                {isAuthenticated ? (
                    <div className='avatar-container' ref={menuRef}>
                        <img
                            src={avatarUrl}
                            alt='User Avatar'
                            className='avatar-icon'
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                        <div className={`side-menu ${menuOpen ? 'side-menu-open' : ''}`}>
                            <p className="current_role">Viewing as: {currentRole}</p>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/library" onClick={() => setMenuOpen(false)}>Library</Link>
                            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                            <Link to="/edit-profile" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
                            {availableRoles.length > 1 && (
                                <div className="role-switcher">
                                    <p>Change role</p>
                                    {availableRoles.map(item => (
                                        
                                            <a key={item.role}
                                            onClick={() => {
                                                setCurrentRole(item.role)
                                                setMenuOpen(false)
                                            }}
                                            className={currentRole === item.role ? 'active-role' : ''}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                            
                            <button onClick={() => { setMenuOpen(false); logout(); }}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <button onClick={onLoginClick}>Login</button>
                        <button onClick={onSignupClick}>Register</button>
                    </>
                )}
            </nav>
        </header>
        </>
    )
}