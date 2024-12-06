import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../axios'

function LogIn({toggleComponent}) {
  const navigate = useNavigate()

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
        console.log(token)
        localStorage.setItem('token',token)
        alert("user succeessfully registered")
        navigate('/home')
    } catch (error){
        alert("something went wrong")
        console.log(error)

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