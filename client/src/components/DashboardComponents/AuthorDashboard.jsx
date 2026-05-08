import useDisplayName from '../../hooks/useDisplayName'


export default function AuthorDashboard() {
    const displayName = useDisplayName()


    return (
        <div className="dashboard">
            <h1>Author Dashboard</h1>
            <p>Welcome, {displayName}</p>
        </div>
    )
}