import './home.css'

export default function CTA() {

    return(
        <section className='cta_section'>

            <div className='cta_card'>
                <h2>Ready to Start Reading?</h2>
                <p>Start building your Novel eShelf library and discover your next favorite story.</p>
                <button className='primary_btn'>Browse Books</button>
            </div>

            <div className='cta_card'>
                <h2>Are You An Author?</h2>
                <p>Publish your work and connect with passionate readers.</p>
                <button className='secondary_btn'>Start Publishing</button>
            </div>

        </section>
    )
}