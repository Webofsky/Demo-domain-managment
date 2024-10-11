import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import Nav from './Nav'
import BasicSelect from "./servicesAssets/BasicSelect";
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary,  AccordionActions} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from "./utils/AuthContext";
import PaymentForm from "./servicesAssets/paymentForm";

const Services = () => {

    const [currentText, setCurrentText] = useState('')
    const [currentCost, setCurrentCost] = useState(0)
    const [currentDomain, setCurrentDomain] = useState('')
    const [currentClient, setCurrentClient] = useState('')
    const [clients, setClients] = useState(false)

    const {getNewToken} = useContext(AuthContext)

    const handeAddNewTask = (newClientData) => {
        setClients(prevState =>prevState.map(client=> {
            if (client._id === currentClient) {
                console.log(newClientData)
                return newClientData
            } else {
                return client
            }
        }))
    }

    const handleDeleteTask = (newClientData) => {
        setClients(prevState => prevState.map(client => {
            if(client._id === newClientData._id) {
                console.log(newClientData)
                return newClientData
            } else {
                return client
            }
        }))
    }

    const handleAddNewPayment = (newClientData) => {
        setClients(prevState => prevState.map(client => {
            if (client._id === newClientData._id) {
                return newClientData
            } else {
                return client
            }
        }))
    }

    const deleteTask = async (client, domain, service) => {
        //client -> _id | domain -> name | service -> _id
        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')

        try {
            const response = await axios.delete(`https://demo-domain-managment.onrender.com/deletetask/${client}`,
                
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken 
                    },
                    data: {domain, service}
                }
            )
            console.log(response)
            handleDeleteTask(response.data)
            console.log('task has deleted')
            setCurrentText('')
            setCurrentCost(0)
        } catch (error) {
            console.log(error)
            await getNewToken(refreshToken)
            const newAuthToken = localStorage.getItem('authToken')

            
        try {
            const response = await axios.delete(`https://demo-domain-managment.onrender.com/deletetask/${client}`,
                
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + newAuthToken 
                    },
                    data: {domain, service}
                }
            )
            console.log(response)
            handleDeleteTask(response.data)
            console.log('task has deleted')
            setCurrentText('')
            setCurrentCost(0)
        } catch (error) {
            console.log(error)
        }
        }

    }

    const addNewTask = async (e)=> {
        e.preventDefault()
        e.currentTarget.reset()

        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')
        
        try {
            const task = {
                text: currentText,
                domain: currentDomain,
                cost: currentCost
            }
            const response = await axios.put(`https://demo-domain-managment.onrender.com/task/${currentClient}`,
            task,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken 
                }
            }
            )
            console.log(response.data)
            console.log("task has added")
            handeAddNewTask(response.data)
            setCurrentText('')
            setCurrentCost(0)
        } catch (error) {
            console.log(error)
            await getNewToken(refreshToken)
            const newAuthToken = localStorage.getItem('authToken')
            try {
                const task = {
                    text: currentText,
                    domain: currentDomain,
                    cost: currentCost
                }
                const response = await axios.put(`https://demo-domain-managment.onrender.com/task/${currentClient}`,
                task,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + newAuthToken
                    }
                }
                )
                console.log(response.data)
                console.log("task has added")
                handeAddNewTask(response.data)
                setCurrentText('')
                setCurrentCost(0)
            } catch (error) {
                console.log(error)
            }
        }
   
    }

    const addNewPayment = async (client, domain, service, paymentText, paymentCost) => {
        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')

        const payment = {
            text: paymentText,
            cost: paymentCost
        }

        try {
            const response = await axios.put(`https://demo-domain-managment.onrender.com/task/payment/${client}/${domain}/${service}`,
                payment, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + authToken 
                    } 
                }        
            )
            console.log(response)
            handleAddNewPayment(response.data)

        } catch (error) {
            console.log(error)
            await getNewToken(refreshToken)
            const newAuthToken = localStorage.getItem('authToken')
            try {
                const response = await axios.put(`https://demo-domain-managment.onrender.com/task/payment/${client}/${domain}/${service}`,
                    payment, 
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + newAuthToken 
                        } 
                    }        
                )
                console.log(response)
                handleAddNewPayment(response.data)
    
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect( ()=>{
        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')

        const fetchData = async ()=> {
            try{
                const response = await axios.get('https://demo-domain-managment.onrender.com/clients',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + authToken 
                        }
                    }
                )
                setClients(response.data)
                
            }catch(error){
                console.log(error)
                await getNewToken(refreshToken)
                const newAuthToken = localStorage.getItem('authToken')
                try{
                    const response = await axios.get('https://demo-domain-managment.onrender.com/clients',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + newAuthToken 
                            }
                        }
                    )
                    setClients(response.data)
                }catch(error){
                    console.log(error)
                }
            }
        }
        fetchData()
    },
    [getNewToken])
    return(
        <div className="flex flex-col w-full items-center">
            <Nav/>
            <div className="flex flex-col w-11/12 pt-4">
                <div className="flex flex-col border-gray border p-4 rounded-xl">
                    { clients && clients.map( client=> (
                        client.domains.map( domain => (
                            domain.services.map((service, index) => (
                                <div className="w-full flex flex-col" key={index}>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel3-content"
                                            id="panel3-header"
                                            >
                                            <h1 className='text-bl text-blue-600 text-xl font-semibold'>{domain.name}</h1>
                                            <h1 className='text-bl pl-10 text-xl'> {service.title}</h1>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                            <hr></hr>
                                            <hr></hr>
                                            <PaymentForm
                                                onAddPayment={(paymentText, paymentCost) => addNewPayment(client._id, domain.name, service._id, paymentText, paymentCost)}
                                                service={service}
                                            />
                                            <hr></hr>
                                            <hr></hr>    
                                            </AccordionDetails>
                                            <AccordionActions>
                                            <IconButton color='primary' onClick={()=> deleteTask(client._id, domain.name, service._id)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </AccordionActions>
                                    </Accordion>
                                </div>
                            ))
                        ))
                    ))}
                </div>
                <form className="flex w-full flex-row " onSubmit={(e)=>addNewTask(e)}>
                    <BasicSelect clients={clients} setCurrentClient={setCurrentClient} setCurrentDomain={setCurrentDomain} />
                    <input className='flex w-9/12 border-gray border-2 pl-1'
                        type="text"
                        placeholder="New task to do"
                        onChange={(e) => setCurrentText(e.target.value)}
                    ></input>
                        <input className='flex w-2/5 border-gray border-2 pl-1'
                        type="number"
                        placeholder="Cost"
                        onChange={(e) => setCurrentCost(e.target.value)}
                        ></input>
                        <div className="flex w-1/4 justify-center items-center">
                        <IconButton color="primary" type="submit">
                                <AddCircleIcon sx={{fontSize: 35}} />
                        </IconButton>
                        </div>
                </form>
            </div>
        </div>
    )
}

export default Services