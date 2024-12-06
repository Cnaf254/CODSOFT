import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import re from '../../assets/react.svg'

export default function Header() {
  const navigate = useNavigate()
  const [isLoggedIn, setLoggedIn]=useState(!!localStorage.getItem("token"))
  const handleAuth = () =>{
    isLoggedIn?(localStorage.removeItem('token'),setLoggedIn(false),navigate('/')):navigate('/home');
  }
  return (
    <div class="text-white flex flex-col w-1/5 bg-blue-950 min-h-screen justify-between items-center">
      <div class="pt-3">
        <img src={re} alt="" class="pb-10"/>
        <ul class="pb-6">
          <li class="pb-5">
            <a href="/home">Home</a>
          </li>
          <li class="pb-5">
            <a href="/blogdetail">Blog</a>
          </li>
          <li class="pb-5">
            <a href="/myprofile">My Profile</a>
          </li>
          <li class="pb-5">
            <a href="/post">Post</a>
          </li>
          
        </ul>
      </div>
      
        <button class="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg mb-5" onClick={handleAuth}> {isLoggedIn ? 'Logout' : 'Sign In'}</button>
      
    </div>
  )
}
