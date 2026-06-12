export default function BookDetailDescription({ description }) {
    if (!description) return null

    return (
        <div className='bd-section'>
            <h2 className='bd-section-title'>About this book</h2>
            <div className='bd-description'>
                {description.split('\n').map((para, i) =>
                    para.trim() ? <p key={i}>{para}</p> : null
                )}
            </div>
        </div>
    )
}