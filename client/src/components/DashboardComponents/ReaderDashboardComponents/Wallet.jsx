import useAuthStore from '../../../store/authStore'
import blackInkImg from '../../../assets/images/blackink.png'
import goldInkImg from '../../../assets/images/goldink.png'
import quillImg from '../../../assets/images/quill.png'
import '../ReaderDashboardComponents/readerDashboard.css';

export default function RenderWalletBar() {
    const wallet = useAuthStore((state) => state.user?.wallet)

    return (
        <section className='reader-section'>
            <h3>Your wallet</h3>
            <p className='reader-wallet-subnote'>
                All three currencies unlock chapters — spent automatically in this order: Black Ink Drops first, then Gold Ink Drops, then Quills.
            </p>
            <div className='reader-stats-grid'>
                <div className='reader-stat-item'>
                    <img src={blackInkImg} alt='' className='reader-stat-icon reader-stat-icon--ink' />
                    <p className='reader-stat-label'>Black Ink Drops</p>
                    <h2 className='reader-stat-value'>{wallet?.black_ink_balance ?? 0}</h2>
                    <p className='reader-stat-explainer'>Earned daily just by logging in.</p>
                </div>
                <div className='reader-stat-item'>
                    <img src={goldInkImg} alt='' className='reader-stat-icon reader-stat-icon--ink' />
                    <p className='reader-stat-label'>Gold Ink Drops</p>
                    <h2 className='reader-stat-value'>{wallet?.gold_ink_balance ?? 0}</h2>
                    <p className='reader-stat-explainer'>Earned by watching ads.</p>
                </div>
                <div className='reader-stat-item'>
                    <img src={quillImg} alt='' className='reader-stat-icon reader-stat-icon--quill' />
                    <p className='reader-stat-label'>Quills</p>
                    <h2 className='reader-stat-value'>{wallet?.quill_balance ?? 0}</h2>
                    <p className='reader-stat-explainer'>Purchased — never expire, always available.</p>
                </div>
            </div>
        </section>
    );
}