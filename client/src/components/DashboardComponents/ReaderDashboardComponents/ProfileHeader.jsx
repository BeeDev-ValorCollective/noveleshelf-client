import './readerDashboard.css'

export default function ReaderProfileHeader() {
    return (
        <section className='reader-section reader-profile-header'>
            <div className='reader-profile-header-content'>
                <div className='reader-profile-left'>
                    <img
                        src="/media/avatars/reader/default.png"
                        alt="Reader Avatar"
                        className='reader-profile-avatar'
                    />
                    <div className='reader-profile-info'>
                        <h1 className='reader-profile-name'>
                            Eleanor Whitmore
                        </h1>
                        <p className='reader-profile-username'>@eleanor_reads</p>
                        <div className='reader-prfile-badges'>
                            <span className='reader-badge reader-badge-reader'>Reader</span>
                            <span className='reader-badge reader-badge-premium'>Premium</span>
                        </div>
                        <p className='reader-profile-bio'>Passionate reader with a love for literary fiction and contemporary narratives.</p>
                    </div>
                </div>
                <div className='reader-profile-right'>
                    <button className='reader-edit-profile-btn'>Edit Profile</button>
                    <button className='reader-settings-btn'>⚙</button>
                </div>
            </div>
        </section>
    )
}