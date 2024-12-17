import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

function SignUp({ handleRenderComponent }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await axios.post("/users/register", {
        username,
        email,
        password,
      });
      alert("User successfully registered");
      window.location.reload();
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white rounded-md p-6 shadow-xl relative">
        

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign Up
          </button>

          {/* Toggle to Log In */}
          <div className="text-center mt-4">
            <p className="text-gray-700">
              If you already have an account,{" "}
              <span
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => handleRenderComponent("login")}
              >
                Log in here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
