"use client";
import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in...", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-96"
    >
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
}
