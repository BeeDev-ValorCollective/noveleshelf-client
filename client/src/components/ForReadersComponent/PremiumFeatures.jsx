import { Bookmark, Type, Highlighter } from 'lucide-react'
import "./forReaders.css"

export default function PremiumFeatures() {
    return (
        <>
            <section className='premium-features'>
                <h2>Premium Reading Features</h2>
                <div className='features-grid'>
                    <div className='feature-card'>
                        <Bookmark className='feature-icon' />
                        <h3>Smart Bookmarks</h3>
                        <p>Never lose your place. Our intelligent bookmarking system syncs across all devices and remembers exactly where you left off.</p>
                    </div>
                    <div className='feature-card'>
                        <Type className='feature-icon' />
                        <h3>Customizable Typography</h3>
                        <p>Choose from premium fonts, adjust sizing, spacing, and margins to create your perfect reading experience.</p>
                    </div>
                    <div className='feature-card'>
                        <Highlighter className="feature-icon" />
                        <h3>Highlights & Notes</h3>
                        <p>Capture your thoughts with elegant highlighting and note-taking tools. Export and share your insights effortlessly.</p>
                    </div>
                </div>
            </section>
        </>
    )
}