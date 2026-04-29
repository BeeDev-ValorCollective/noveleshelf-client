import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'
import Avatar from '../../assets/images/avatar.png'
import { useState, useRef, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import useLogout from '../../hooks/useLogout'
import { Link } from 'react-router-dom'

export default function Header({ onLoginClick, onSignupClick }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { logout } = useLogout()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

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
                            src={Avatar}
                            alt='User Avatar'
                            className='avatar-icon'
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                        <div className={`side-menu ${menuOpen ? 'side-menu-open' : ''}`}>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/library" onClick={() => setMenuOpen(false)}>Library</Link>
                            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                            <Link to="/edit-profile" onClick={() => setMenuOpen(false)}>Edit Profile</Link>
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