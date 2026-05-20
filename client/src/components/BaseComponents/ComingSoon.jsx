import './baseComponents.css'

export default function ComingSoon({ title, description }) {
    return (
        <div className='dashboard-section'>
            <div className='coming-soon-card'>
                <div className='coming-soon-icon'>✦</div>
                <h2 className='coming-soon-title'>{title}</h2>
                <p className='coming-soon-text'>
                    {description || 'This section is coming soon. Check back after launch!'}
                </p>
            </div>
        </div>
    )
}