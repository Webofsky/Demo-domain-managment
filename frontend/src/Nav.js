import React, { useContext } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { AuthContext } from './utils/AuthContext'
import { Link } from 'react-router-dom';

function Nav() {

    const {setAuthToken, setRefreshToken, setLogoutAlert} = useContext(AuthContext)

    const handleLogOutBtn = () => {
        localStorage.clear()
        setAuthToken('')
        setRefreshToken('')
        setLogoutAlert(true)

    }

  return (
    <div className='w-full h-auto bg-theme flex flex-row justify-center mb-10'>
        <div className='w-11/12 flex flex-row items-center justify-between'>
            <Link to="/">
                <div className='flex flex-row items-center'>
                    <div className='w-16'>
                        <img src='/images/logo.png' alt="logo"/>
                    </div>
                    <h1 className='text-primary'>Admin Panel</h1>
                </div>
            </Link>
            <nav className='flex flex-row items-center  justify-around w-3/4 text-primary text-xl'>
                <Link to="/clients">Clients</Link>
                <Link to="/services">Services</Link>
            </nav>
            <div>
                <button className='text-primary' onClick={handleLogOutBtn}>Log Out</button>
                <PersonIcon fontSize='large' sx={{ color : '#ddd6fe', cursor : 'pointer'}} onClick={handleLogOutBtn}/>
            </div>
        </div>
    </div>
  )
}

export default Nav