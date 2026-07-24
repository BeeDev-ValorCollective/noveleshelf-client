import Hero from "../components/ForAuthorsComponent/Hero"
import AuthorDashboard from "../components/ForAuthorsComponent/AuthorDashboard"
import EarningsAnalytics from "../components/ForAuthorsComponent/EarningsAnalytics"
import ChapterUpload from "../components/ForAuthorsComponent/ChapterUpload"
import DRMProtection from "../components/ForAuthorsComponent/DRMProtection"
import ForAuthorsUpgradeSection from "../components/ForAuthorsComponent/ForAuthorsUpgradeSection"

export default function ForAuthors({ onLoginClick }) {
    return (
        <>
            <Hero />
            <AuthorDashboard />
            <EarningsAnalytics />
            <ChapterUpload />
            <DRMProtection />
            <ForAuthorsUpgradeSection onLoginClick={onLoginClick} />
        </>
    )
}