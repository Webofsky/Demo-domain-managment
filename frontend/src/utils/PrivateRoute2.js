import {Outlet, Navigate} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

const PrivateRoute2 = () => {

    const {authToken} = useContext(AuthContext)

    return(
        !authToken ? <Outlet/> : <Navigate to='/'/>
    )
}

export default PrivateRoute2