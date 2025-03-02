"use client";
import { useState } from "react";

export default function OTPForm() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Verifying OTP...", otp);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-96"
    >
      <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
      <input
        type="text"
        name="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
        Verify OTP
      </button>
    </form>
  );
}
