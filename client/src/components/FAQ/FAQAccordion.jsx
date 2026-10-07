import { useState } from 'react'
import Button from '../ui/Button'
import './FAQTeaser.css'

export default function FaqAccordion({ items }) {
    // Track which question ID is open (null means all closed)
    const [openId, setOpenId] = useState(null)

    const toggleItem = (id) => {
        setOpenId(openId === id ? null : id)
    }

    return (
        <div className="faq-accordion-list">
            {items.map((item) => {
                const isOpen = openId === item.id

                return (
                    <div 
                        key={item.id} 
                        className={`faq-item ${isOpen ? 'is-open' : ''}`}
                    >
                        <Button
                            variant='bare'
                            size='lg'
                            className="faq-question-btn" 
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isOpen}
                        >
                            <span>{item.question}</span>
                            <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                        </Button>

                        {isOpen && (
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}