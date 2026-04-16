import useUser from "../hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();

    return (
        <div>
            <h1>Welcome to your dashboard</h1>
            {user ? (
                <>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.default_login_role}</p>
                    <p>Username: {user.profile?.username || 'Not set'}</p>
                    <p>Quills: {user.wallet?.quill_balance}</p>
                    <p>Gold Ink: {user.wallet?.gold_ink_balance}</p>
                    <p>Black Ink: {user.wallet?.black_ink_balance}</p>
                </>
            ) : (
                <p>Logged in and loading user data...</p>
            )}
        </div>
    );
}