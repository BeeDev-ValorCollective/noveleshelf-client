import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthComponents/AuthCard";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";

import "../components/AuthComponents/auth.css";

export default function Signup() {
  const navigate = useNavigate();

    const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
  };

  return (
    <AuthCard>

      <button className="close-btn">×</button>

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
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <PrimaryButton type="submit">
          Create Account
        </PrimaryButton>
      </form>

      <p className="login">
        Already have an account?
        <span onClick={() => navigate("/login")}> Sign in</span>
      </p>

      <p className="divider">or continue with</p>

      <div className="social-buttons">
        <button className="social">Google</button>
        <button className="social">Apple</button>
      </div>

    </AuthCard>
  );
}