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
                        <button className='primary_btn'>Start Reading</button>
                        <button className='secondary_btn'>Explore Library</button>
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