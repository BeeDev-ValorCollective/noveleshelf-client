import Hero from "../components/ForAuthorsComponent/Hero"
import AuthorDashboard from "../components/ForAuthorsComponent/AuthorDashboard"
import EarningsAnalytics from "../components/ForAuthorsComponent/EarningsAnalytics"
import ChapterUpload from "../components/ForAuthorsComponent/ChapterUpload"
import DRMProtection from "../components/ForAuthorsComponent/DRMProtection"
import CTA from "../components/ForAuthorsComponent/CTA"

export default function ForAuthors() {
    return (
        <>
            <Hero />
            <AuthorDashboard />
            <EarningsAnalytics />
            <ChapterUpload />
            <DRMProtection />
            <CTA />
        </>
    )
}