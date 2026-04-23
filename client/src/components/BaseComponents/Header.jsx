import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'
import useAuthStore from '../../store/authStore'
import useLogout from '../../hooks/useLogout'



export default function Header({ onLoginClick, onSignupClick }) {
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
                {isAuthenticated ? (
                    <>
                        <a href='/dashboard'>Dashboard</a>
                        <a onClick={logout} href="#">Logout</a>
                    </>
                ) : (
                    <>
                        <button onClick={onLoginClick}>LogIn</button>
                        <button onClick={onSignupClick}>Sign Up</button>
                    </>
                )}
            </nav>
            
        </header>
        </>
    )
}