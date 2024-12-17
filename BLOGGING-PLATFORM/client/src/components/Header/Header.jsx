import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import blogLogo from "../../assets/blogLogo.webp";
import { userProvider } from "../../Context/UserProvider";

export default function Header({ logOut }) {
  const [user] = useContext(userProvider);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu toggle

  function handleButtonClick() {
    if (user) {
      logOut();
    }
  }

  return (
    <header className="sticky top-0 bg-gray-900 text-white shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={blogLogo} alt="Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold">Cnaf Blog</h1>
        </div>

        {/* Hamburger Icon (Mobile View) */}
        <button
          className="block lg:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Navigation Links (Desktop View) */}
        <nav
          className={`lg:flex items-center space-x-8 ${
            menuOpen ? "block" : "hidden"
          } lg:block`}
        >
          <ul className="flex flex-col lg:flex-row items-center lg:space-x-6">
            <li>
              <Link
                to="/home"
                className="hover:text-orange-500 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/myprofile"
                className="hover:text-orange-500 transition duration-200"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/post"
                className="hover:text-orange-500 transition duration-200"
              >
                Post
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Button */}
        <button
          className="hidden lg:block px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition duration-200"
          onClick={handleButtonClick}
        >
          {user?.userName ? "Log Out" : "Sign In"}
        </button>
      </div>

      {/* Mobile Menu: Action Button */}
      {menuOpen && (
        <div className="block lg:hidden px-4 pb-4">
          <button
            className="w-24 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={handleButtonClick}
          >
            {user?.userName ? "Log Out" : "Sign In"}
          </button>
        </div>
      )}
    </header>
  );
}
