import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { userProvider } from "../../Context/UserProvider";

function LogIn({handleRenderComponent}) {
  const navigate = useNavigate();
  const [user, setUser] = useContext(userProvider);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogIn(e) {
    e.preventDefault();
    try {
      const result = await axios.post("/users/login", {
        email,
        password,
      });
      const token = result.data.token;
      localStorage.setItem("token", token);

      setUser({
        userName: result.data.userName,
        userId: result.data.userid,
        email: result.data.email,
      });

      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Invalid credentials. Please check your email and password.");
      } else {
        console.log("Something went wrong:", error.message);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white rounded-md p-6 shadow-xl relative">
        

        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
        <form onSubmit={handleLogIn} className="space-y-4">
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
            Log In
          </button>

          {/* Toggle to Sign Up */}
          <div className="text-center mt-4">
            <p className="text-gray-700">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => handleRenderComponent("register")}
              >
                Register here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
