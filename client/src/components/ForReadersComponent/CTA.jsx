import Button from '../ui/Button'
import './forReaders.css'

export default function CTA() {
    return (
        <>
        <section className='readers-cta'>
            <h2>Start Your Reading Journey Today</h2>
            <p>Join thousands of readers discovering their next favorite book</p>
            <Button to='/signup' variant='primary' size='lg' className='cta-button'>
                Get Started for Free
            </Button>
        </section>
        </>
    )
}