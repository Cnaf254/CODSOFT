import React,{useState, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axios'
import { userProvider } from '../../Context/UserProvider';

function LogIn({toggleComponent}) {
const navigate = useNavigate()
const [user, setUser] = useContext(userProvider)

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function handleLogIn(e){
    e.preventDefault()
    try{
        const result= await axios.post("/users/login",{
            email,
            password,
        })
        const token= result.data.token;
        localStorage.setItem('token',token)
        
        setUser({
          userName:result.data.userName,
          userId:result.data.userid,
          email:result.data.email,
        })
        
        navigate('/home')
    } catch (error){
      if (error.response && error.response.status === 400) {
        // Handle the "invalid credential" error here
        alert("Invalid credentials. Please check your email and password.");

        // You can set this error message to display in your UI or perform any other actions
      } else {
        console.log("Something went wrong:", error.message);
        // Handle other error scenarios if needed
      }

    }
    
} 

  return (
    <div className="max-w-md w-full space-y-8 bg-gray-300 rounded-md p-6 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
        <form
          onSubmit={handleLogIn}
          className="space-y-4"
        >
          

         
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={`w-full p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            LogIn
          </button>
          
          {/* Login Link */}
          <div className="text-center mt-4">
            
            <p class="text-orange-700"> If you have not an account,<span class=" hover:text-orange-500 cursor-pointer" onClick={toggleComponent}>register here</span></p>
          </div>
        </form>
      </div>
  )
}

export default LogIn