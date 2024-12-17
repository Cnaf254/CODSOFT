import React, { useState } from "react";
import { FaBlog, FaEdit, FaUsers, FaSignInAlt, FaUserPlus, FaComments, FaSearch } from "react-icons/fa";
import bgimage from '../../assets/images/bg.webp';
import SignUp from "../SignUp/SignUp";
import LogIn from "../LogIn/LogIn";

function Landing() {
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleRenderComponent = (component) => {
    setCurrentComponent(component);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Section 1: Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 bg-opacity-80"></div>
        <div className="z-10 text-gray-900 px-6">
          <h1 className="text-5xl font-extrabold leading-snug animate-zigzag">
            <FaBlog className="inline-block text-blue-700 mr-2" />
            Welcome to Cnaf Blog
          </h1>
          <p className="text-xl mt-4 font-light">
            Dive into a world of creativity, innovation, and stories. Whether you’re a seasoned
            blogger or a newcomer, Cnaf Blog is your gateway to sharing ideas, connecting with
            like-minded individuals, and exploring new horizons.
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={() => handleRenderComponent("login")}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 rounded-lg shadow-lg text-lg font-semibold flex items-center gap-2"
            >
              <FaSignInAlt />
              Sign In
            </button>
            <button
              onClick={() => handleRenderComponent("register")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 rounded-lg shadow-lg text-lg font-semibold flex items-center gap-2"
            >
              <FaUserPlus />
              Get Started
            </button>
          </div>
          {/* Zigzag Promotional Text */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold tracking-wider">
              <span className="block text-blue-700 font-bold animate-bounce">Create. Share. Inspire.</span>
              <span className="block text-green-600 font-light italic animate-pulse">Write your story, your way.</span>
              <span className="block text-purple-800 font-bold underline animate-fade">Connect with readers globally.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Section 2: About Section */}
      <div className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-teal-400 bg-opacity-60"></div>
        <div className="z-10 px-6 max-w-4xl text-gray-800">
          <h2 className="text-4xl font-bold flex items-center gap-2 justify-center">
            <FaEdit className="text-green-700" />
            Why Choose Cnaf Blog?
          </h2>
          <p className="text-lg mt-4 font-light leading-relaxed">
            Blogging isn’t just about words; it’s about making an impact. At Cnaf Blog, you can:
            <br />
            <strong>✨ Share captivating stories:</strong> Bring your ideas to life with our easy-to-use
            publishing tools.
            <br />
            <strong>🌍 Connect with a community:</strong> Meet bloggers and readers who inspire, challenge,
            and support you.
            <br />
            <strong>📈 Grow your audience:</strong> Get your content seen by thousands of readers
            worldwide, from budding creators to seasoned pros.
          </p>
          {/* Circular Text Promo */}
          <div className="mt-8">
            <p className="text-center font-semibold">
              <span className="text-green-600 text-3xl rotate-[30deg] inline-block">Write</span>
              <span className="text-purple-600 text-3xl rotate-[60deg] inline-block">Connect</span>
              <span className="text-blue-600 text-3xl rotate-[90deg] inline-block">Grow</span>
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Features Section */}
      <div className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-indigo-400 bg-opacity-60"></div>
        <div className="z-10 px-6 max-w-4xl text-gray-800">
          <h2 className="text-4xl font-bold flex items-center gap-2 justify-center">
            <FaUsers className="text-purple-700" />
            Features to Enhance Your Blogging
          </h2>
          <p className="text-lg mt-4 font-light leading-relaxed">
            Enjoy features designed with you in mind:
          </p>
          <ul className="text-lg mt-4 font-light list-disc list-inside text-left">
            <li>
              <strong>💬 Interactive Comments:</strong> Engage with readers and foster meaningful
              discussions.
            </li>
            <li>
              <strong>🔍 Advanced Search:</strong> Find posts, comments, or users with ease using
              our intuitive search tools.
            </li>
            <li>
              <strong>📱 Responsive Design:</strong> Enjoy seamless blogging on any device, whether
              it’s your desktop or phone.
            </li>
          </ul>
          {/* Triangle Text Promo */}
          <div className="mt-8">
            <p className="text-lg font-extrabold">
              <span className="block text-indigo-600 text-2xl tracking-wider">Engage</span>
              <span className="block text-pink-600 text-2xl tracking-wider">Explore</span>
              <span className="block text-purple-600 text-2xl tracking-wider">Create</span>
            </p>
          </div>
        </div>
      </div>

      {/* Render Selected Component */}
      {currentComponent && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          {currentComponent === "login" ? (
            <LogIn handleRenderComponent={handleRenderComponent} />
          ) : (
            <SignUp handleRenderComponent={handleRenderComponent} />
          )}
         <button
  onClick={() => setCurrentComponent(null)}
  className="fixed top-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 z-50"
>
  Close
</button>

        </div>
      )}
    </div>
  );
}

export default Landing;
