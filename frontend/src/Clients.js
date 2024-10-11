import React, {useState, useEffect, useContext, useCallback} from 'react'
import Nav from './Nav'
import AddNewUser from './clientsAssets/AddNewUser';
import EditUser from './clientsAssets/EditUser';
import AccordionUsage from './clientsAssets/AccordionUsage';
import { Button } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { AuthContext } from './utils/AuthContext';
import axios from 'axios';

const Clients = () => {

const {getNewToken} = useContext(AuthContext)

const [clients, setClients] = useState([])
const [addNewBtn, setAddNewBtn] = useState(false)
const [editBtn, setEditBtn] = useState(false)

const getClients = useCallback (async () => {

        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')

        try {
            const response = await axios.get('https://demo-domain-managment.onrender.com/clients',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken 
                    }
                }
            )
            setClients(response.data)
        }
        catch(err) {
            console.log(err)
            await getNewToken(refreshToken)
            const newAuthToken = localStorage.getItem('authToken')
            try {
                const response = await axios.get('https://demo-domain-managment.onrender.com/clients',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + newAuthToken
                        }
                    }
                )
                setClients(response.data)
            }
            catch(err) {
                console.log(err)
            }
        }
    },[getNewToken])

    const handeAddNewBtn = () => {
        setAddNewBtn(true)
        setEditBtn(false)
    }


    useEffect(()=> {
        getClients()
    },[getClients])

  return (
    <div className='w-full flex flex-col items-center'>
        <Nav/>
        <div className='w-11/12 h-auto flex flex-col items-center md:flex-row md:justify-between md:items-start'>
            <div className='flex flex-col w-full md:w-1/2'>
                <AccordionUsage clients={clients} setClients={setClients} setEditBtn={setEditBtn} setAddNewBtn={setAddNewBtn}/>
                <div className='flex w-full flex-row justify-center py-4'>
                <Button variant="outlined" startIcon={<GroupAddIcon/>} onClick={handeAddNewBtn}> Add New Client</Button>
                </div>         
            </div>
            {
                addNewBtn && <div><AddNewUser setAddNewBtn={setAddNewBtn} setClients={setClients}/></div>
            }
            {
                editBtn && <div><EditUser client={editBtn} setEditBtn={setEditBtn} setClients={setClients}/></div>
            }
            
        </div>
    </div>
  )
}

export default Clients