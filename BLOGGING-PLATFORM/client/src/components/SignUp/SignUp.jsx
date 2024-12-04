import React, { useState } from "react";
import axios from "../axios"; // Ensure axios is correctly imported
import bgimage from '../../assets/images/bg.webp';

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store validation errors
  const [submitted, setSubmitted] = useState(false); // Track if form is submitted

  // Function to handle password validation
  function isPasswordStrong(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  }

  // Function to handle form submission
  async function handleSignUp(e) {
    e.preventDefault(); // Prevent default form submission
    setSubmitted(true); // Mark the form as submitted to trigger validation

    // Check if all fields are filled
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Validate email format
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    setError(""); // Clear any previous error messages

    try {
      // Post user data to the backend
      await axios.post("/users/register", {
        username,
        email,
        password, // Send the password (hashed on the backend ideally)
      });

      alert("Sign-up successful!");

      // Clear form fields after successful submission
      setUsername("");
      setEmail("");
      setPassword("");
      setSubmitted(false); // Reset the submitted flag
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Sign-up failed. Please try again.");
    }
  }

  // Function to determine border color based on validation error
  const getInputClass = (fieldName) => {
    if (submitted && !fieldName) {
      return "border-red-500"; // Apply red border if the field is empty
    }
    if (error && (fieldName === "username" || fieldName === "email" || fieldName === "password")) {
      return "border-red-500"; // Apply red border for error
    }
    return "border-gray-300"; // Default border
  };

  return (
    <div
      className="min-h-screen bg-cover bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full gap-10"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Zigzag Text above the form */}
      <div className="text-center mb-12 ">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-zigzag">
          Welcome to our Blog Website
        </h1>
        <p className="text-xl mt-4 text-gray-800">
          Share anything you want and connect with others!
        </p>
      </div>

      <div className="max-w-md w-full space-y-8 bg-gray-300 rounded-md p-6 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form
          onSubmit={handleSignUp}
          className="space-y-4"
        >
          {error && (
            <div className="text-red-500 text-center mb-4">
              <p>{error}</p>
            </div>
          )}

          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`w-full p-3 ${getInputClass(username)} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full p-3 ${getInputClass(email)} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full p-3 ${getInputClass(password)} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
          
          {/* Login Link */}
          <div className="text-center mt-4">
            <span className="text-sm text-blue-500 hover:underline cursor-pointer">
              If you have an account, <a href="/login">login here</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
