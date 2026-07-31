import Button from '../ui/Button';
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
                        <Button to='/signup' variant='primary' size='lg'>
                            Become a Reader
                        </Button>
                        <Button to='/library' variant='secondary' size='lg'>
                            Explore Library
                        </Button>
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