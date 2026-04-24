import Hero from "../components/ForReadersComponent/Hero"
import PremiumFeatures from "../components/ForReadersComponent/PremiumFeatures"
import Discover from '../components/ForReadersComponent/Discover'
import ReadingModes from '../components/ForReadersComponent/ReadingModes'
import ReadAnywhere from "../components/ForReadersComponent/ReadAnywhere"
import CTA from "../components/ForReadersComponent/CTA"

export default function ForReaders() {
    return (
        <>
            <Hero />
            <PremiumFeatures />
            <Discover />
            <ReadingModes />
            <ReadAnywhere />
            <CTA />
        </>
    )
}