import './freeAuthorDashboard.css';

const projects = [
    { title: "Carmen", status: "Draft" },
    { title: "Lolita", status: "In Progress" },
]

export default function FreeAuthorProjects() {
    return (
        <section className='reader-section'>
            <h2 className='reader-section-heading'>My Projects</h2>
            <p className='reader-section-subheading'>Works in progress</p>
            <div className='free-author-projects-list'>
                {projects.map((project, index) => (
                    <div key={index} className='free-author-project-card'>
                        <div className='free-author-cover-placeholder'>
                            {project.title}
                        </div>
                        <div className='free-author-project-info'>
                            <h3 className='free-author-project-title'>{project.title}</h3>
                            <span className='free-author-project-status'>{project.status}</span>
                        </div>
                        <button className='free-author-continue-btn'>Continue Editing</button>
                    </div>
                ))}
            </div>
        </section>
    )
}