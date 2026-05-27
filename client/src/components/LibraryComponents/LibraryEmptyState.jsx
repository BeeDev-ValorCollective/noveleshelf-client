export default function LibraryEmptyState({ loading = false }) {
    return (
        <div className='library-empty'>
            <div className='library-empty-shelves'>
                <svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg' className='empty-shelf-svg'>
                    <rect x='20' y='240' width='360' height='8' rx='2' fill='#2dd4bf' opacity='0.4'/>
                    <rect x='20' y='160' width='360' height='8' rx='2' fill='#7b5ea7' opacity='0.4'/>
                    <rect x='20' y='80' width='360' height='8' rx='2' fill='#e879a0' opacity='0.4'/>
                    <rect x='20' y='72' width='8' height='176' rx='2' fill='#2dd4bf' opacity='0.3'/>
                    <rect x='372' y='72' width='8' height='176' rx='2' fill='#2dd4bf' opacity='0.3'/>
                    {[60,100,140,180,220,260,300,340].map((x, i) => (
                        <rect key={i} x={x} y={i % 2 === 0 ? 168 : 172} width={18} height={i % 2 === 0 ? 70 : 66} rx='2' fill='#1a1530' stroke='#7b5ea7' strokeWidth='0.5' opacity='0.5'/>
                    ))}
                    {[50,90,130,170,210,250,290,330].map((x, i) => (
                        <rect key={i} x={x} y={i % 2 === 0 ? 88 : 92} width={18} height={i % 2 === 0 ? 70 : 66} rx='2' fill='#1a1530' stroke='#e879a0' strokeWidth='0.5' opacity='0.5'/>
                    ))}
                </svg>
            </div>
            <h2 className='library-empty-title'>
                {loading ? 'Loading the shelves...' : "We're busy stocking the shelves."}
            </h2>
            <p className='library-empty-subtitle'>
                {loading ? '' : 'Check back soon — stories are on their way.'}
            </p>
        </div>
    )
}