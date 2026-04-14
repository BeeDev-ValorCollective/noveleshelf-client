import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthComponents/AuthCard";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";

import "../components/AuthComponents/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <AuthCard>

      <button className="close-btn">×</button>

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

        <PrimaryButton type="submit">
          Sign In
        </PrimaryButton>
      </form>

        <p className="forgot" onClick={() => navigate("/reset-password")}>
            Forgot password?
        </p>

      <p className="signup">
        Don’t have an account?
        <span onClick={() => navigate("/signup")}> Sign up</span>
      </p>

      <p className="divider">or continue with</p>

      <div className="social-buttons">
        <button className="social">Google</button>
        <button className="social">Apple</button>
      </div>

    </AuthCard>
  );
}