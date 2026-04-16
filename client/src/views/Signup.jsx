import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthCard from "../components/AuthComponents/AuthCard";
import InputField from "../components/AuthComponents/InputField";
import PrimaryButton from "../components/AuthComponents/PrimaryButton";
import useAuthStore from "../store/authStore";

import "../components/AuthComponents/auth.css";

const DB_API = `${import.meta.env.VITE_DB_API}`

export default function Signup() {

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

    const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    try {
        const response = await fetch('https://api.noveleshelf.com/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: form.email,
                password: form.password,
                confirm_password: form.confirm_password,
                date_of_birth: form.date_of_birth,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setAuth(data.user, data.tokens.access, data.tokens.refresh);
            navigate('/dashboard');
        } else {
            console.error('Registration failed:', data);
            alert(data.email?.[0] || data.confirm_password?.[0] || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
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
          name="confirm_password"
          placeholder="••••••••"
          value={form.confirm_password}
          onChange={handleChange}
        />

        <InputField
          label="Birthdate"
          type="date"
          name="date_of_birth"
          placeholder="••••••••"
          value={form.date_of_birth}
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