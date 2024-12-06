import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home';
import Post from './components/Post/Post'
import Landing from './components/Landing/Landing'
import MyProfile from './components/MyProfile/MyProfile';
import BlogDetail from './components/BlogDetail/BlogDetail';



function App() {
  const [count, setCount] = useState(0)

  return (
<Router>
<div class="flex">
<Header/>
<Routes>
<Route path="/" element={<Landing />} />
<Route path="/home" element={<Home/>} /> 
<Route path="/post" element={<Post/>} />
<Route path="/myprofile" element={<MyProfile/>} />
<Route path="/blogdetail" element={<BlogDetail/>} />
</Routes>

</div>
</Router>
    )
}

export default App
