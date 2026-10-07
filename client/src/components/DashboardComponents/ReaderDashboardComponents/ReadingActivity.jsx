import { CheckCircle, Bookmark, Highlighter, Star } from 'lucide-react';

import './readerDashboard.css';

const activities = [
    { icon: 'check', text: 'Finished Whispers of Time - rated 4.5', time: '2 days ago' },
    { icon: 'bookmark', text: 'Added Midnight Gardens to Saved Books', time: '5 days ago' },
    { icon: 'highlight', text: 'Highlighted 3 passages in The Silent Echo', time: '1 week ago' },
    { icon: 'star', text: 'Reviewed: The Last Chapter - 5 stars', time: '2 weeks ago' },
]

export default function ReadingActivity() {
    return (
        <section className='reader-section'>
            <h2 className='reader-section-heading'>Reading Activity</h2>
            <p className='reader-section-subheading'> Your recent literary moments</p>
            <div className='activity-list'>
                {activities.map((activity, index) => (
                    <div key={index} className='activity-item'>
                        <div className='activity-left'>
                            <span className='activity-icon'>
                                {activity.icon === 'check' && <CheckCircle size={18} />}
                                {activity.icon === 'bookmark' && <Bookmark size={18} />}
                                {activity.icon === 'highlight' && <Highlighter size={18} />}
                                {activity.icon === 'star' && <Star size={18} />}
                            </span>
                            <p className='activity-text'>{activity.text}</p>
                        </div>
                        <span className='activity-time'>{activity.time}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}