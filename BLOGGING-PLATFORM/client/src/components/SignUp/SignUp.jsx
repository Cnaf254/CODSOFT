import {useState} from 'react'
import axios from "../axios"



function SignUp({toggleComponent}) {

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

    async function handleSignUp(e){
        e.preventDefault()
        try{
            await axios.post("/users/register",{
                username,
                email,
                password,
            })
            alert("user succeessfully registered")
            window.location.reload();
            
        } catch (error){
            alert("something went wrong")
            console.log(error)

        }
        console.log("gezu")
    } 
  return (
    <div className="max-w-md w-full space-y-8 bg-gray-300 rounded-md p-6 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an Account
        </h2>
        <form
          onSubmit={handleSignUp}
          className="space-y-4"
        >
          

          <div>
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={`w-full p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
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
            Sign Up
          </button>
          
          {/* Login Link */}
          <div className="text-center mt-4">
            
            <p class="text-orange-700">If you have an account, <span class="hover:text-orange-500 cursor-pointer" onClick={toggleComponent}>login here</span></p>
          </div>
        </form>
      </div>
  )
}

export default SignUp