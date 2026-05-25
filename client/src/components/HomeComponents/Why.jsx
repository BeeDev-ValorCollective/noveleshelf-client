import './home.css'
import { Sparkles, ShieldCheck, BarChart2, Users } from 'lucide-react'

export default function Why() {
    return (
        <section className="main_why_container">
            <h2 className="why_heading">Why Novel eShelf</h2>
            <p className="why_subheading">Built for the modern literary community</p>
            <div className="why_grid">
                <div className="why">
                    <Sparkles className="why_icon" />
                    <h3>Smart Discovery</h3>
                    <p>AI-powered recommendations that understand your reading preferences.</p>
                </div>
                <div className="why">
                    <ShieldCheck className="why_icon" />
                    <h3>Protected Content</h3>
                    <p>Advanced DRM ensures authors work remains secure and respected.</p>
                </div>
                <div className="why">
                    <BarChart2 className="why_icon" />
                    <h3>Transparent Analytics</h3>
                    <p>Real-time insights into readership and earnings for authors.</p>
                </div>
                <div className="why">
                    <Users className="why_icon" />
                    <h3>Community Driven</h3>
                    <p>Connect with fellow readers and authors in our vibrant community.</p>
                </div>
            </div>
        </section>
    )
}