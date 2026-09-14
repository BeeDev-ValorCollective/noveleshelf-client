import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight } from 'lucide-react'


export default function FollowingSection() {
    const navigate = useNavigate()

    return (
        <section className="dashboard-section">
            <button
                type="button"
                className="following-dashboard-card dashboard-card"
                onClick={() => navigate('/following')}
            >
                <div className="following-dashboard-left">
                    <div className="following-dashboard-icon">
                        <Users size={24} />
                    </div>

                    <div>
                        <h2>Following</h2>

                        <p>
                            View the authors you're following.
                        </p>
                    </div>
                </div>

                <ChevronRight size={22} />
            </button>
        </section>
    )
}