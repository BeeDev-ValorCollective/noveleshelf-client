import Logo from '../../assets/images/logo.png'


export default function TextSection() {


    return(
        <>
        <div className="container">
            <div className="text">
                <h1>Your Personal Library, Reimagined</h1>
                <p>Discover, read, and publish literary works in a premium digital environment designed for book lovers and authors alike.</p>
            </div>
            <div className="border-box">
                <div className="logo-glow"></div>
                <img
                src={Logo}
                alt="Novel eShelf Logo"
                className="logo"
                />
            </div>
        </div>
        </>
    )
}