import useDisplayName from "../../hooks/useDisplayName"

export default function ReaderDashboard() {
    const displayName = useDisplayName()

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome, {displayName}</p>
        </div>
    )
}