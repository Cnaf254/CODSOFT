import { useState, useEffect,useContext } from 'react'
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import Home from './components/Home/Home';
import Post from './components/Post/Post'
import Landing from './components/Landing/Landing'
import MyProfile from './components/MyProfile/MyProfile';
import BlogDetail from './components/BlogDetail/BlogDetail';
import axios from './components/axios';


import { userProvider } from './Context/UserProvider';
import PrivateRoute from "./Context/PrivateRoute"

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useContext(userProvider);
  const token = localStorage.getItem("token");
  

  const navigate= useNavigate()

 function logOut() {
    setUser({});
    localStorage.removeItem("token"); // Change to remove the token
    navigate("/"); // Redirect to home or login page
  }

  async function checkUser() {
    try {
      const { data } = await axios.get("/users/check", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setUser({ userName: data.username, userId: data.userid });

     
      
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  }

  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      navigate("/");
    }
  }, [token]);

  
return (

<>
<Header logOut={logOut}/>
<Routes>
<Route path="/" element={<Landing />} />
<Route path="/home" element={
  <PrivateRoute>
      <Home/>
  </PrivateRoute>} /> 
<Route path="/post" element={
  <PrivateRoute>
 <Post/>
</PrivateRoute>
  } />
<Route path="/myprofile" element={
   <PrivateRoute>
   <MyProfile/>
  </PrivateRoute>
  
  } />
<Route path="/blogdetail" element={
   
   <BlogDetail/>
  
  } />
</Routes>

</>

    )
}

export default App
