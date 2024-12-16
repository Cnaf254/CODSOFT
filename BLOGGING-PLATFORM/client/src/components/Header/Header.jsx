import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import re from '../../assets/react.svg';
import { userProvider } from '../../Context/UserProvider';

export default function Header({ logOut }) {
  const [user] = useContext(userProvider);

  function handleButtonClick() {
    if (user) {
      logOut();
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between bg-blue-950 text-white px-4 py-3 shadow-lg w-full">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={re} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-bold">MyApp</span>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col lg:flex-row items-center lg:space-x-8 mt-4 lg:mt-0 space-y-2 lg:space-y-0">
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

      {/* Action Button */}
      <button
        className="mt-4 lg:mt-0 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition duration-200"
        onClick={handleButtonClick}
      >
        {user?.userName ? 'Log Out' : 'Sign In'}
      </button>
    </div>
  );
}
