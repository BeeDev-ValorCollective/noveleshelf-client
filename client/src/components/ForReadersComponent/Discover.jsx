import './forReaders.css'
import LibraryImage from '../../assets/images/library.png'

export default function Discover() {
    return (
        <>
            <section className='discover'>
                <div className='discover-text'>
                    <h2>Discover Your Next Favorite Book</h2>
                    <p>Our AI-powered recommendation engine learns your preferences and suggests books you'll love. The more you read, the smarter it gets.</p>
                </div>
                <div className='discover-image'>
                    <img src={LibraryImage} alt="Library" className='discover-img' />
                </div>
            </section>
        </>
    )
}