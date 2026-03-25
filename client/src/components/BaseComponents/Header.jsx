
import './baseComponents.css'
import Shelf from '../../assets/images/shelf.png'


export default function Header() {



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
        </header>
        </>
    )
}