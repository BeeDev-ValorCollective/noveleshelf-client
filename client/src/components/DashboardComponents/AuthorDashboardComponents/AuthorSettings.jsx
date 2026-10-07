import Button from '../../ui/Button'
import './authorDashboard.css'

export default function AuthorSettings() {
    return (
        <section className='dashboard-section author-settings'>
            <h2 className='section-heading'>Author Settings</h2>
            <p className='section-subheading'>Manage your publishing preferences and financial information</p>
            <div className='settings-grid'>
                <div className='settings-column dashboard-card'>
                    <h3 className='settings-column-title'>Publishing Preferences</h3>
                    <div className='setting-item'>
                        <div className='setting-info'>
                            <p className='setting-name'>Auto-publish chapters</p>
                            <p className='setting-desc'>Automatically publish chapters when written</p>
                        </div>
                        <div className='toggle active'></div>
                    </div>
                    <div className='setting-item'>
                        <div className='setting-info'>
                            <p className='setting-name'>Reader comments enabled</p>
                            <p className='setting-desc'>Allow readers to comment on your works</p>
                        </div>
                        <div className='toggle active'></div>
                    </div>
                    <div className='setting-item'>
                        <div className='setting-info'>
                            <p className='setting-name'>Email notifications</p>
                            <p className='setting-desc'>Receive email updates on reader activity</p>
                        </div>
                        <div className='toggle active'></div>
                    </div>
                    <Button
                        variant='ghost'
                        size='md'
                    >
                        Change your preferences
                    </Button>
                </div>
                <div className='settings-column dashboard-card'>
                    <h3 className='settings-column-title'>Revenue & Payout</h3>
                    <div className='balance-card'>
                        <p className='balance-label'>Current Balance</p>
                        <h2 className='balance-value'>$18,420</h2>
                        <p className='balance-sub'>Available for withdrawal</p>
                    </div>
                    <div className='payout-item'>
                        <p className='payout-label'>This month's earnings</p>
                        <p className='payout-value'>$12,540</p>
                    </div>
                    <div className='payout-item'>
                        <p className='payout-label'>Pending Payout</p>
                        <p className='payout-value'>$2,180</p>
                    </div>
                    <div className='payout-item'>
                        <p className='payout-label'>Last Payout</p>
                        <p className='payout-value'>$14,820 on May 14, 2026</p>
                    </div>
                    <div className='payout-actions'>
                        <p className='payout-btn'>View payout history</p>
                        <p className='payout-btn'>Update payment method</p>
                    </div>
                </div>
            </div>
        </section>
    )
}