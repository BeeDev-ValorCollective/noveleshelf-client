import './home.css'
import { BookOpen, PenTool, RefreshCw } from 'lucide-react'

export default function Offerings() {
    return (
        <section className='main_offering_container'>
            <h2 className='offering_heading'>What We Offer</h2>
            <p className='offering_subheading'>A complete ecosystem for readers and authors</p>
            <div className="offering_grid">
                <div className="offering">
                    <BookOpen className='offering_icon' />
                    <h3>Curated Library</h3>
                    <p>Access thousands of novels across all genres, carefully curated for quality and diversity.</p>
                </div>
                <div className="offering">
                    <PenTool className='offering_icon' />
                    <h3>Author Platform</h3>
                    <p>Publish your work with professional tools, DRM protection, and transparent analytics.</p>
                </div>
                <div className="offering">
                    <RefreshCw className='offering_icon' />
                    <h3>Seamless Sync</h3>
                    <p>Read anywhere with automatic syncing across all your devices and platforms.</p>
                </div>
            </div>
        </section>
    )
}