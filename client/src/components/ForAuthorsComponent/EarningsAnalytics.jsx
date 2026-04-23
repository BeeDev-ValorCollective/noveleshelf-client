import './forAuthors.css'
import { TrendingUp, DollarSign, Eye } from 'lucide-react'

export default function EarningsAnalytics() {
    return(
        <>
            <section className='earnings-analytics'>
                <h2>Earnings & Analytics</h2>
                <div className='earnings-grid'>
                    <div className='earnings-card'>
                        <DollarSign className='earnings-icon' />
                        <p className='earnings-label'>This month</p>
                        <h3 className='earnings-value'>$4,293.50</h3>
                        <p className='earnings-sub'>+18% from last month</p>
                    </div>
                    <div className='earnings-card'>
                        <TrendingUp className='earnings-icon' />
                        <p className='earnings-label'>Total Earnings</p>
                        <h3 className='earnings-value'>$38,742</h3>
                        <p className='earnings-sub'>Since January 2027</p>
                    </div>
                    <div className='earnings-card'>
                        <Eye className='earnings-icon' />
                        <p className='earnings-label'>Total Reads</p>
                        <h3 className='earnings-value'>127,493</h3>
                        <p className='earnings-sub'>Across all your books</p>
                    </div>
                </div>
            </section>
        </>
    )
}