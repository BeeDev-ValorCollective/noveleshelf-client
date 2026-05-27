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

export default function Signup({ onClose, isModal, onSwitchToLogin }) {
  const setTokens = useAuthStore((state) => state.setTokens)
  const { closeAndNavigate, safeClose } = useModalAuth(onClose);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${DB_API}${ENDPOINTS.signup}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirm_password: form.confirm_password,
          date_of_birth: form.date_of_birth,
        }),
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
        setError(
          data.email?.[0] ||
          data.confirm_password?.[0] ||
          "Registration failed"
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      closeAndNavigate("/login");
    }
  };

  const inner = (
    <AuthCard>
      <button onClick={safeClose} className="close-btn">×</button>

      <h1>Create Your Account</h1>
      <p className="subtitle">Join a premium digital reading experience</p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          type="email"
          name="email"
          placeholder="reader@example.com"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirm_password"
          placeholder="••••••••"
          value={form.confirm_password}
          onChange={handleChange}
        />
        <InputField
          label="Birthdate"
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <PrimaryButton type="submit" isLoading={isLoading}>Create Account</PrimaryButton>
      </form>

      <p className="login">
        Already have an account?
        <span onClick={handleLoginClick}> Sign in</span>
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