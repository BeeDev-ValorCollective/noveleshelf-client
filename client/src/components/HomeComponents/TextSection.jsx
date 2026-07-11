import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import './home.css';

export default function TextSection() {

    return(
        <section className='hero_section'>
            <div className="hero_container">

                <div className="hero_text">
                    <h1>Your Personal Library, Reimagined</h1>
                    <p>Discover, read, and publish literary works in a premium digital environment designed for book lovers and authors alike.</p>
                    <div className='hero_buttons'>
                        <Link to='/signup' className='primary_btn'>Become a Reader</Link>
                        <Link to='/library' className='secondary_btn'>Explore Library</Link>
                    </div>
                </div>
                <div className='hero_logo_container'>
                    <img
                        src={Logo}
                        alt="Novel eShelf Logo"
                        className="hero_logo"
                    />
                </div>

            </div>
        </section>
    )
}