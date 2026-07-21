import { Link } from 'react-router-dom' // Or your app's router
import FaqAccordion from './FAQAccordion'
import { readerFaq } from '../../data/faq/readerFAQ'
import './faqTeaser.css'

export default function FaqTeaserSection() {
    // Grab the first section's items (or flatten top items)
    const teaserQuestions = readerFaq[0]?.items || []

    return (
        <section className="faq-teaser-section">
            <h2 className="faq-teaser-title">Frequently Asked Questions</h2>
            <p className="faq-teaser-subtitle">
                Have a quick question? Check out some of our most common inquiries below.
            </p>

            {/* Reusable Accordion Component */}
            <FaqAccordion items={teaserQuestions} />

            <div className="faq-teaser-cta">
                <p>Have more questions?</p>
                <Link to="/faq" className="primary_btn">
                    View All 70+ FAQs →
                </Link>
            </div>
        </section>
    )
}