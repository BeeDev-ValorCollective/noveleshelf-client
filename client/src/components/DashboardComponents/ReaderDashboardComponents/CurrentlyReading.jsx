import './readerDashboard.css';

export default function CurrentlyReading() {
    return (
        <section className='reader-section'>
            <h2 className='reader-section-heading'>Currently Reading</h2>
            <p className='reader-section-subheading'>Continue your literary journey</p>
            <div className='currently-reading-card'>
                <div className='currently-reading-cover-placeholder'>
                    The Midnight Library
                </div>
                <div className='currently-reading-info'>
                    <h3 className='currently-reading-title'>The Midnight Library</h3>
                    <p className='currently-reading-author'>By Matt Haig</p>
                    <p className='currently-reading-desc'>A dazzling novel about all the choice that go into a life well lived.</p>
                    <p className='currently-reading-chapter'>Chapter 19 of 26</p>
                </div>
                <div className='currently-reading-right'>
                    <p className='reading-progress'>65%</p>
                    <button className='continue-reading-btn'>Continue Reading</button>
                </div>
            </div>
        </section>
    );
}