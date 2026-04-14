export default function AuthCard({ children }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        {children}
      </div>
    </div>
  );
}