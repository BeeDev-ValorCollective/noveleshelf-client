import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

import AuthCard from "../components/AuthComponents/AuthCard";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";

import "../components/AuthComponents/auth.css";

const DB_API = `${import.meta.env.VITE_DB_API}`

export default function Login({ onClose, isModal }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(DB_API + 'auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuth(data.user, data.tokens.access, data.tokens.refresh);

        // check roles and route accordingly
        if (data.user.admin_profile || data.user.author_profile || data.user.moderator_profile) {
          // multi role user - show gate
          // for now just go to dashboard
          navigate('/dashboard');
        } else {
          // reader only - go to dashboard
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    }
  };
  if (isModal) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <AuthCard>

      <button onClick={onClose} className="close-btn">×</button>

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

        <PrimaryButton type="submit">
          Sign In
        </PrimaryButton>
      </form>

      <p className="forgot" onClick={() => navigate("/reset-password")}>
        Forgot password?
      </p>

      <p className="signup">
        Don't have an account?
        <span onClick={() => navigate("/signup")}> Sign up</span>
      </p>

      <p className="divider">or continue with</p>

      <div className="social-buttons">
        <button className="social">Google</button>
        <button className="social">Apple</button>
      </div>

    </AuthCard>
    </div>
    </div>
  );
}
}