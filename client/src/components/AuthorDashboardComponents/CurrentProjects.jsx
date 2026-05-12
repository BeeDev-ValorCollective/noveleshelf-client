import './authorDashboard.css'

export default function CurrentProjects() {
    return(
        <section className='dashboard-section current-projects'>
            <h2 className='section-heading'>Current Projects</h2>
            <p className='section-subheading'>Works in progress</p>
            <div className='projects-list'>
                <div className='project-card dashboard-card'>
                    <div className='project-cover-placeholder'>
                        <p>Echoes of Tomorrow</p>
                    </div>
                    <div className='project-info'>
                        <h3 className='project-title'>Echoes of Tomorrow</h3>
                        <span className='project-status draft'>Draft</span>
                    </div>
                    <button className='continue-editing-btn'>Continue Editing</button>
                </div>
            </div>
        </section>
    )
}