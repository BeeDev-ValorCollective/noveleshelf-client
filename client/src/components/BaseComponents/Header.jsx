import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useLogout from '../../hooks/useLogout'


export default function Header() {
    const navigate = useNavigate()
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const { logout } = useLogout()

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
                <a href="#">For Readers</a>
                <a href="#">For Authors</a>
                <a href="#">Shop</a>
            </nav>
            <div className="auth-buttons">
                {isAuthenticated ? (
                    <>
                        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/signup')}>Sign Up</button>
                )}
            </div>
        </header>
        </>
    )
}