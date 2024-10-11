import React, { useState, useContext } from 'react'
import { Skeleton } from '@mui/material'
import axios from 'axios'
import { AuthContext } from './utils/AuthContext'

const Hosting = () => {

    const [directData, setDirectData] = useState(false)
    const [clientData, setClientData] = useState(false)
    const [wpData, setWpData] = useState(false)

    const {getNewToken} = useContext(AuthContext)

    const getPass = async (name) => {

        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')
        
        try {
            const response = await axios.get(`https://demo-domain-managment.onrender.com/hosting/${name}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken 
                    }
                }
            )
            console.log(response.data)
            if(name === 'direct') {
                setDirectData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
            } else if (name === 'client') {
                setClientData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
            } else if (name === 'wordpress') {
                setWpData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
            } else {
                throw new Error ('Error while trying to display login and password')
            }
        }
        catch (error) {
            try {
                await getNewToken(refreshToken)
                const newAuthToken = localStorage.getItem('authToken')
                const response = await axios.get(`https://demo-domain-managment.onrender.com/hosting/${name}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + newAuthToken 
                        }
                    }
                )
                console.log(response.data)
                if(name === 'direct') {
                    setDirectData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
                } else if (name === 'client') {
                    setClientData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
                } else if (name === 'wordpress') {
                    setWpData(prevState => ({ ...prevState , login: response.data.login, password: response.data.password}))
                } else {
                    throw new Error ('Error while trying to display login and password')
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    }

  return (
    <div className='w-auto flex flex-col items-center pb-10 px-10'>
        <div className='w-full flex flex-col items-center mb-10'>
        </div>
        <div className='flex flex-col'>
            <h1 className='text-3xl font-bold text-secondary'>Cyberfolks Admin:</h1>
            <hr></hr>
            {directData ? 
            <div>
                <h2 className='text-lg font-bold text-secondary '>Login:<br/><b>{directData.login}</b></h2>
                <h2 className='text-lg font-bold text-secondary '>Hasło:<br/><b>{directData.password}</b></h2>
            </div>
            : <div>
                <h2 className='text-lg font-bold text-secondary '>Login:</h2><Skeleton animation="wave" />
                <h2 className='text-lg font-bold text-secondary '>Hasło:</h2><Skeleton animation="wave" />
                <div className='flex w-full flex-row justify-end'>
                    <h4 className='flex font-semibold cursor-pointer' onClick={()=>getPass('direct')}>Show Data</h4>
                </div>  
            </div>}
        </div>
        <div className='flex flex-col pt-10'>
            <h1 className='text-3xl font-bold text-secondary '>Cyberfolks Client Panel: </h1>
            <hr></hr>
            {clientData ? 
            <div>
                <h2 className='text-lg font-bold text-secondary '>Login:<br/><b>{clientData.login}</b></h2>
                <h2 className='text-lg font-bold text-secondary '>Hasło:<br/><b>{clientData.password}</b></h2>
            </div>
            : <div>
                <h2 className='text-lg font-bold text-secondary '>Login:</h2><Skeleton animation="wave" />
                <h2 className='text-lg font-bold text-secondary '>Hasło:</h2><Skeleton animation="wave" />
                <div className='flex w-full flex-row justify-end'>
                    <h4 className='flex font-semibold cursor-pointer' onClick={()=>getPass('client')}>Show Data</h4>
                </div>  
            </div>}
        </div>
        <div className='flex flex-col pt-10'>
            <div className='flex flex-row items-center'>
                <div>
                    <div className='flex w-20 flex-'>
                        <img src='/images/wordpress-logo.png' alt="wordpress" className='flex object-cover'/>
                    </div>
                </div>
                <h1 className='text-3xl font-bold text-secondary flex pl-2'>Wordpress Managment:</h1>
            </div>
            <hr></hr>
            {wpData ? 
            <div>
                <h2 className='text-lg font-bold text-secondary '>Login:<br/><b>{wpData.login}</b></h2>
                <h2 className='text-lg font-bold text-secondary '>Hasło:<br/><b>{wpData.password}</b></h2>
            </div>
            : <div>
                <h2 className='text-lg font-bold text-secondary '>Login:</h2><Skeleton animation="wave" />
                <h2 className='text-lg font-bold text-secondary '>Hasło:</h2><Skeleton animation="wave" />
                <div className='flex w-full flex-row justify-end'>
                    <h4 className='flex font-semibold cursor-pointer' onClick={()=>getPass('wordpress')}>Show Data</h4>
                </div>  
            </div>}
        </div>             
    </div>
  )
}

export default Hosting