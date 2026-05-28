import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthComponents/AuthCard";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";

import "../components/AuthComponents/auth.css";

export default function NewPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    // Send token + new password to backend
    if (import.meta.env.DEV) {
      console.log({
        token,
        password: form.password,
      });
    }

    // After success
    navigate("/login");
  };

  return (
    <AuthCard>

      <h1>Create New Password</h1>
      <p className="subtitle">
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit}>
        <InputField
          label="New password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        <InputField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <PrimaryButton type="submit">
          Reset Password
        </PrimaryButton>
      </form>

    </AuthCard>
  );
}