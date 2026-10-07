import { useState } from "react";
import "./password.css";

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

export default function PasswordInput({ className = "", wrapperClassName = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`pw-wrapper ${wrapperClassName}`}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`pw-input ${className}`}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
      />
      <button
        type="button" // prevents the toggle from submitting the form
        className="pw-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={0}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}