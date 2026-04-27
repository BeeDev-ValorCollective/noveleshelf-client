export default function PrimaryButton({ children, isLoading, ...props }) {
  return (
    <button className="login-btn" disabled={isLoading} {...props}>
      {isLoading ? "Please wait..." : children}
    </button>
  );
}