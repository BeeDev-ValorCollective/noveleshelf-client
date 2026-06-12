import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../../components/AuthComponents/AuthCard";
import InputField from "../../components/AuthComponents/InputField";
import PrimaryButton from "../../components/AuthComponents/PrimaryButton";

import "../../components/AuthComponents/auth.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <AuthCard>

      <button className="close-btn">×</button>

      <h1>Reset Password</h1>
      <p className="subtitle">
        Enter your email address and we’ll send you a reset link
      </p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          type="email"
          name="email"
          placeholder="reader@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PrimaryButton type="submit">
          Send Reset Link
        </PrimaryButton>
      </form>

      <p className="signup">
        <span onClick={() => navigate("/login")}>
          Back to Sign In
        </span>
      </p>

    </AuthCard>
  );
}