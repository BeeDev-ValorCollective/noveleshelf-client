import './authorDashboard.css'

export default function ProfileHeader() {
    return (
        <section className='dashboard-section profile-header'>
            <div className='profile-header-content'>
                <div className='profile-header-left'>
                    <div className='profile-avatar-container'>
                        <img
                            src='/media/avatars/reader/default.png'
                            alt='Author Avatarar'
                            className='profile-avatar'
                        />
                    </div>
                    <div className='profile-info'>
                        <h1 className='profile-name'>Jonathan Rivers</h1>
                        <p className='profile-username'>@jonathan_rivers</p>
                        <div className='profile-badges'>
                            <span className='badge badge-author'>Author</span>
                            <span className='badge badge-pro'>Pro</span>
                        </div>
                        <p className='profile-bio'>Award winning author of contemporary fiction and literary thrillers. Passionate about crafting imersive narratives that explore the complexities of human nature and modern society.</p>
                    </div>
                </div>
                <div className='profile-header-right'>
                    <button className='edit-profile-btn'>Edit Profile</button>
                    <button className='settings-btn'>⚙</button>
                </div>
            </div>
        </section>
    )
}