import useDisplayName from "../../hooks/useDisplayName"

export default function ModeratorDashboard() {
    const displayName = useDisplayName()

    return (
        <div className="dashboard">
            <h1>Moderator Dashboard</h1>
            <p>Welcome, {displayName}</p>
        </div>
    )
}