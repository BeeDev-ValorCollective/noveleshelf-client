export default function PrimaryButton({ children, ...props }) {
  return (
    <button className="login-btn" {...props}>
      {children}
    </button>
  );
}