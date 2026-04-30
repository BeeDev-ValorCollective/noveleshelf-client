import useDisplayName from '../../hooks/useDisplayName'


export default function AdminDashboard() {
    const displayName = useDisplayName()


    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {displayName}</p>
        </div>
    )
}