import './index.css';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AdminLogin from "./AdminLogin";
import Home from './Home';
import Clients from './Clients';
import Services from './srvices';
import PrivateRoute from './utils/PrivateRoute';
import PrivateRoute2 from './utils/PrivateRoute2';
import { AuthContext } from './utils/AuthContext';
import axios from 'axios';
import { Alert } from '@mui/material';
import {Helmet} from 'react-helmet'

function App() {

  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [loginAlert, setLoginAlert] = useState(false)
  const [logoutAlert, setLogoutAlert] = useState(false)
  const [addUser, setAddUser] = useState(false)
  const [editUser, setEditUser] = useState(false)

  const getNewToken = async (refreshToken) => {
    try {
      const response = await axios.post('https://demo-domain-managment.onrender.com/token', {
          token: refreshToken
      }, {
          headers: {
              'Content-Type': 'application/json'
          }
      })        
      localStorage.setItem('authToken', response.data.authToken);
      setAuthToken(authToken)

  } catch (error) {
      localStorage.clear()
      setAuthToken('')
      setRefreshToken('')
      console.log('Auth token expired and RefreshToken is wrong')
  }
}

  useEffect(()=> {
    if (loginAlert) {
      const timer = setTimeout(()=>setLoginAlert(false), 2000)
      return ()=> clearTimeout(timer)
    } else if (logoutAlert) {
      const timer = setTimeout(()=>setLogoutAlert(false),2000)
      return ()=> clearTimeout(timer)
    } else if (addUser) {
      const timer = setTimeout(()=>setAddUser(false),2000)
      return ()=> clearTimeout(timer)
    } else if (editUser) {
      const timer = setTimeout(()=>setEditUser(false),2000)
      return ()=> clearTimeout(timer)
    }

  },[loginAlert, logoutAlert, addUser, editUser])

  return (
    <div className="w-full flex flex-col">
          <Helmet>
      <meta name="robots" content="noindex, nofollow" />
          </Helmet>
      <div className='w-full fixed '>
        {editUser && <Alert severity="success">The client has been edited successfuly</Alert>}
        {addUser && <Alert severity="success">The client has been added successfuly</Alert>}
        {loginAlert && <Alert severity="success">The proceess of login in has been completed successfuly.</Alert>}
        {logoutAlert && <Alert severity="info">The process of log out has been completed successfuly</Alert>}
      </div>
      <AuthContext.Provider value={{ authToken, setAuthToken, refreshToken, setRefreshToken, setLoginAlert, setLogoutAlert, getNewToken, setAddUser, setEditUser }}>
        <Router>
          <Routes>
            <Route element={<PrivateRoute/>}>
              <Route element={<Home/>} path='/' exact/>
              <Route element={<Clients/>} path='clients'/>
              <Route element={<Services/>} path='services'/>
            </Route>
            <Route element={<PrivateRoute2/>}>
              <Route element={<AdminLogin/>} path='/login'/>
            </Route>
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
