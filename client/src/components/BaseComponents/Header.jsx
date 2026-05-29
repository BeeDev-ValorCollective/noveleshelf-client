import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useLogout from '../../hooks/useLogout'
import { getMediaUrl } from '../../utils/api'
import { toTitleCase } from '../../utils/upperCase'
import { Menu, X } from 'lucide-react'

const APP_URL = import.meta.env.VITE_APP_URL
const DJANGO_ADMIN_URL = import.meta.env.VITE_DJANGO_ADMIN_URL

export default function Header({ onLoginClick, onSignupClick }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const user = useAuthStore((state) => state.user)
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    const setCurrentRole = useAuthStore((state) => state.setCurrentRole)
    const { logout } = useLogout()
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const menuRef = useRef(null)
    const mobileNavRef = useRef(null)
    const navigate = useNavigate()

    const avatarUrl = getMediaUrl(currentProfile?.avatar_url)

    const availableRoles = []
    if (user?.profile) availableRoles.push({ role: 'reader', label: 'Reader' })
    if (user?.free_author_profile) availableRoles.push({ role: 'free_author', label: 'Free Author' })
    if (user?.author_profile) availableRoles.push({ role: 'author', label: 'Author' })
    if (user?.moderator_profile) availableRoles.push({ role: 'moderator', label: 'Moderator' })
    if (user?.admin_profile) availableRoles.push({ role: 'admin', label: 'Admin' })

    const getMenuItems = () => {
        switch (currentRole) {
            case 'free_author':
                return (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        {/* <Link to="/my-books" onClick={() => setMenuOpen(false)}>My Books</Link> */}
                        <Link to="/author/create-book" onClick={() => setMenuOpen(false)}>New Book</Link>
                    </>
                )
            case 'author':
                return (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        {/* <Link to="/author/my-books" onClick={() => setMenuOpen(false)}>My Books</Link> */}
                        <Link to="/author/create-book" onClick={() => setMenuOpen(false)}>New Book</Link>
                    </>
                )
            case 'moderator':
                return (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        {/* <Link to="/flagged-content" onClick={() => setMenuOpen(false)}>Flagged Content</Link> */}
                    </>
                )
            case 'admin':
                return (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        <Link to="/admin/users" onClick={() => setMenuOpen(false)}>User Management</Link>
                        <Link to="/admin/author-requests" onClick={() => setMenuOpen(false)}>Author Requests</Link>
                        <Link to="/admin/book-approvals" onClick={() => setMenuOpen(false)}>Book Approvals</Link>
                        {user?.admin_profile?.is_super_admin && (
                            <a
                                href={DJANGO_ADMIN_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMenuOpen(false)}
                            >
                                Django Admin
                            </a>
                        )}
                    </>
                )
            default:
                // reader
                return (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        {/* <a href={`${APP_URL}/library`} onClick={() => setMenuOpen(false)}>My Library</a> */}
                        {/* <a href={`${APP_URL}/shop`} onClick={() => setMenuOpen(false)}>Shop</a> */}
                    </>
                )
        }
    }

    // Close avatar menu on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close mobile nav on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
                setMobileNavOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Lock body scroll when mobile nav is open
    useEffect(() => {
        if (mobileNavOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileNavOpen])

    return (
        <>
            {/* Mobile nav overlay */}
            {mobileNavOpen && (
                <div
                    className='"mobile-nav-overlay'
                    onClick={() => setMobileNavOpen(false)}
                />
            )}
            <header>
                <div className="title">
                    <img src={Shelf} alt="Novel eShelf" className="shelfImg" />
                    <h1>Novel eShelf</h1>
                </div>

                {/* Desktop Nav */}
                <nav className='desktop-nav'>
                    <Link to="/">Home</Link>
                    <Link to="/library">Library</Link>
                    <Link to="/for-readers">For Readers</Link>
                    <Link to="/for-authors">For Authors</Link>
                    {isAuthenticated ? (
                        <div className='avatar-container' ref={menuRef}>
                            <img
                                src={avatarUrl}
                                alt='User Avatar'
                                className='avatar-icon'
                                onClick={() => setMenuOpen(!menuOpen)}
                            />
                            <div className={`side-menu ${menuOpen ? 'side-menu-open' : ''}`}>
                                <p className="current_role">Viewing as: {toTitleCase(currentRole)}</p>
                                {getMenuItems()}
                                {availableRoles.length > 1 && user?.is_verified && (
                                    <div className="role-switcher">
                                        <p>Change current role</p>
                                        <div className="avail-roles">
                                            {availableRoles.map(item => (

                                                <a key={item.role}
                                                    onClick={() => {
                                                        navigate('/dashboard')
                                                        setTimeout(() => setCurrentRole(item.role), 50)
                                                        setMenuOpen(false)
                                                    }}
                                                    className={currentRole === item.role ? 'active-role' : ''}
                                                >
                                                    {item.label}
                                                </a>
                                            ))}
                                        </div>
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

                {/* Mobile Hamburger Toggle */}
                <button
                    className='mobile-menu-toggle'
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Nav Drawer */}
                <div
                    ref={mobileNavRef}
                    className={`mobile-nav ${mobileNavOpen ? 'mobile-nav-open' : ''}`}
                >
                    <div className='mobile-nav-header'>
                        <img src={Shelf} alt="Novel eShelf" className="shelfImg" />
                        <h1 className='title-text'>Novel eShelf</h1>
                    </div>
                    <div className='mobile-nav-links'>
                        <Link to="/" onClick={() => setMobileNavOpen(false)}>Home</Link>
                        <Link to="/library" onClick={() => setMobileNavOpen(false)}>Library</Link>
                        <Link to="/for-readers" onClick={() => setMobileNavOpen(false)}>For Readers</Link>
                        <Link to="/for-authors" onClick={() => setMobileNavOpen(false)}>For Authors</Link>
                        {isAuthenticated ? (
                            <>
                                <div className="mobile-nav-divider" />
                                <p className="mobile-nav-role">Viewing as: {toTitleCase(currentRole)}</p>
                                {currentRole === 'free_author' && (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                                        {/* <Link to="/my-books" onClick={() => setMobileNavOpen(false)}>My Books</Link> */}
                                        <Link to="/author/create-book" onClick={() => setMobileNavOpen(false)}>New Book</Link>
                                    </>
                                )}
                                {currentRole === 'author' && (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                                        {/* <Link to="/author/my-books" onClick={() => setMobileNavOpen(false)}>My Books</Link> */}
                                        <Link to="/author/create-book" onClick={() => setMobileNavOpen(false)}>New Book</Link>
                                    </>
                                )}
                                {currentRole === 'moderator' && (
                                    <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                                )}
                                {currentRole === 'admin' && (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                                        <Link to="/admin/users" onClick={() => setMobileNavOpen(false)}>User Management</Link>
                                        <Link to="/admin/author-requests" onClick={() => setMobileNavOpen(false)}>Author Requests</Link>
                                        <Link to="/admin/book-approvals" onClick={() => setMobileNavOpen(false)}>Book Approvals</Link>
                                        {user?.admin_profile?.is_super_admin && (
                                            <a
                                                href={DJANGO_ADMIN_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Django Admin
                                            </a>
                                        )}
                                    </>
                                )}
                                {(currentRole === 'reader' || !currentRole) && (
                                    <Link to="/dashboard" onClick={() => setMobileNavOpen(false)}>Dashboard</Link>
                                )}
                                {availableRoles.length > 1 && user?.is_verified && (
                                    <>
                                        <div className="mobile-nav-divider" />
                                        <p className="mobile-nav-role">Change current role</p>
                                        <div className="mobile-avail-roles">
                                            {availableRoles.map(item => (

                                                <a key={item.role}
                                                    onClick={() => {
                                                        navigate('/dashboard')
                                                        setTimeout(() => setCurrentRole(item.role), 50)
                                                        setMobileNavOpen(false)
                                                    }}
                                                    className={currentRole === item.role ? 'active-role' : ''}
                                                >
                                                    {item.label}
                                                </a>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="mobile-nav-divider" />
                                <button
                                    className="mobile-nav-logout"
                                    onClick={() => { setMobileNavOpen(false); logout(); }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mobile-nav-divider" />
                                <button
                                    className="mobile-nav-btn"
                                    onClick={() => { setMobileNavOpen(false); onLoginClick(); }}
                                >
                                    Login
                                </button>
                                <button
                                    className="mobile-nav-btn"
                                    onClick={() => { setMobileNavOpen(false); onSignupClick(); }}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}