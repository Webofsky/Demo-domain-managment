import {Outlet, Navigate} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

const PrivateRoute = () => {

    const {authToken} = useContext(AuthContext)
    return(
        authToken? <Outlet/> : <Navigate to='/login'/>
    )
}

export default PrivateRoute