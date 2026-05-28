import { useState } from "react";
import useAuthStore from "../store/authStore";
import { DB_API, ENDPOINTS } from '../utils/api'

import AuthModal from "../components/AuthComponents/AuthModal";
import AuthCard from "../components/AuthComponents/AuthCard";
import AuthPage from "../components/AuthComponents/AuthPage";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";
import useModalAuth from "../hooks/useModalAuth";

import "../components/AuthComponents/auth.css";


export default function Login({ onClose, isModal, onSwitchToSignup }) {
  const setTokens = useAuthStore((state) => state.setTokens)
  const { closeAndNavigate, safeClose } = useModalAuth(onClose);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${DB_API}${ENDPOINTS.login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTokens(data.tokens.access, data.tokens.refresh)

        // DEV ONLY - remove before production
        if (import.meta.env.DEV) {
          console.log('🔑 DEV TOKENS:', {
              access: data.tokens.access,
              refresh: data.tokens.refresh
          })
      }
        closeAndNavigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      closeAndNavigate("/signup");
    }
  };

  const inner = (
    <AuthCard>
      <button onClick={safeClose} className="close-btn">×</button>

      <h1>Welcome Back</h1>
      <p className="subtitle">Continue your reading journey</p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          type="email"
          placeholder="reader@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <PrimaryButton type="submit" isLoading={isLoading}>Sign In</PrimaryButton>
      </form>

      <p className="forgot" onClick={() => closeAndNavigate("/reset-password")}>
        Forgot password?
      </p>

      <p className="signup">
        Don't have an account?
        <span onClick={handleSignupClick}> Sign up</span>
      </p>

      <p className="divider">or continue with</p>
      <div className="social-buttons">
        <button className="social">Google</button>
        <button className="social">Apple</button>
      </div>
    </AuthCard>
  );

  if (isModal) {
    return <AuthModal onClose={safeClose}>{inner}</AuthModal>;
  }

  return <AuthPage>{inner}</AuthPage>;
}