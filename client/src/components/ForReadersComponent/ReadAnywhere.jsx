import './forReaders.css'
import DevicesImage from '../../assets/images/devices.png'

export default function ReadAnywhere() {
    return (
        <>
            <section className='read-anywhere'>
                <h2>Read Anywhere, Anytime</h2>
                <div className='read-anywhere-image'>
                    <img src={DevicesImage} alt='Reading devices' className='read-anywhere-img' />
                </div>
                <p className='read-anywhere-text'>Seamlessly sync your library, bookmarks, and reading progress across all your devices. Start on your phone, continue on your tablet, finish on your laptop.</p>
            </section>
        </>
    )
}