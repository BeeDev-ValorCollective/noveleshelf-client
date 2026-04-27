// AuthPage.jsx — full-page centering wrapper for standalone auth routes
export default function AuthPage({ children }) {
  return (
    <div className="login-screen">
      {children}
    </div>
  );
}