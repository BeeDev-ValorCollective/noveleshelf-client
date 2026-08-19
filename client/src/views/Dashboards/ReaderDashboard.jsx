import useUser from '../../hooks/useUser'
import useFullName from '../../hooks/useFullName'
import useAuthStore from '../../store/authStore'
import { useState } from 'react';

import ProfileHeader from '../../components/DashboardComponents/ProfileHeader'
import AuthorUpgradeSection from '../../components/DashboardComponents/AuthorUpgradeSection'
import RenderStatsBar from '../../components/DashboardComponents/ReaderDashboardComponents/StatsBar'
import RenderWalletBar from '../../components/DashboardComponents/ReaderDashboardComponents/Wallet'

import ComingSoon from '../../components/BaseComponents/ComingSoon'

import '../../components/DashboardComponents/ReaderDashboardComponents/readerDashboard.css';


export default function ReaderDashboard() {

    const [loginBonusBadge, setLoginBonusBadge] =
    useState(null);
    const { user } = useUser()
    const currentProfile = useAuthStore((state) => state.currentProfile)
    const currentRole = useAuthStore((state) => state.currentRole)
    if (!user) return <p>Loading...</p>

    const fullName = useFullName()

    return(
        <div  className="reader-dashboard-container">
            <ProfileHeader user={user} currentProfile={currentProfile} fullName={fullName} currentRole={currentRole} loginBonusBadge={loginBonusBadge}/>
            <AuthorUpgradeSection user={user} currentRole={currentRole} onUpgradeSuccess={() => window.location.reload()} />
            <RenderStatsBar onBonusBadgeChange={setLoginBonusBadge}/>
            <RenderWalletBar />
            {/* <SavedBooks /> */}
            {/* <FinishedBooks /> */}
            {/* <ReadingActivity /> */}
            {/* <ReadingPreferences /> */}
            {/* <ComingSoon title="We're busy stocking the shelves." description='The reading experience is coming soon — for now, explore your profile.' /> */}
        </div>

    )
}