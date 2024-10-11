import React, {useState, useContext} from 'react'
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';

const EditUser = ( {setEditBtn, client, setClients} ) => {

        const [name, setName] = useState(client.name);
        const [lastPaid, setLastPaid] =useState('')
        const [expiredAt, setExpiredAt] = useState('')
        const [currentDomain, setCurrentDomain] = useState('')
        const [domains, setDomains] = useState(client.domains)
        const [currentSubdomain, setCurrentSubdomain] = useState('')
        const [acceptBtn, setAcceptBtn] = useState(false)
    
        const {getNewToken, setEditUser} = useContext(AuthContext)

        const addDomain = () => {
            if(currentDomain ==='') return 0;
    
            setDomains(prevDomains => {
                const domainExists = prevDomains.some(domain => domain.name === currentDomain);
                if(!domainExists) {
                    setLastPaid('')
                    setExpiredAt('')
                    return [...prevDomains, { name: currentDomain, subdomains: [], lastPaid: lastPaid, expiredAt: expiredAt}]
                } else return prevDomains
            }
            )
            setAcceptBtn(true)
        }

        const deleteDomain = (throwDomain, sub) => {

            if (sub) {
                setDomains(prevDomains =>
                    prevDomains.map(domain =>
                        domain.name === throwDomain
                        ? {...domain, subdomains: domain.subdomains.filter(subdomain=> subdomain !== sub)}
                        : domain
                    )
                )
            } else {
                setDomains(prevDomains => prevDomains.filter(domain=> domain.name !== throwDomain))
            }
            setAcceptBtn(true)
        }
    
        const addSubdomains = () => {
    
            if (currentSubdomain === '' || currentDomain === '') return 0;
            setDomains(prevDomains => {
                const domainExists = prevDomains.some(domain => domain.name === currentDomain);
        
                if (domainExists) {
                    return prevDomains.map(domain =>
                        domain.name === currentDomain
                            ? { ...domain, subdomains: [...domain.subdomains, currentSubdomain] }
                            : domain
                    );
                } else {
                    return [...prevDomains, { name: currentDomain, subdomains: [currentSubdomain] }];
                }
            });
            setAcceptBtn(true)
        };

        const handleName = (e) => {
            setName(e.target.value)
            setAcceptBtn(true)
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault()
            e.currentTarget.reset()
    
            const newClient = {
                _id: client._id,
                name: name,
                domains: domains
            }
            const authToken = localStorage.getItem('authToken')
            const refreshToken = localStorage.getItem('refreshToken')

            try {
                const response = await axios.put('https://demo-domain-managment.onrender.com/editClient', 
                    newClient, 
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + authToken 
                        }
                    }
                )
                setClients(prevClients => prevClients.map(client =>
                    client._id === response.data._id ? {...response.data} : client
                ));
                setName('')
                setLastPaid('')
                setExpiredAt('')
                setDomains([])
                setCurrentDomain('')
                setCurrentSubdomain('')
                setAcceptBtn(false)
                setEditBtn(false)
                setEditUser(true)
            } catch (error) {
                console.log(error)
                await getNewToken(refreshToken)
                const newAuthToken = localStorage.getItem('authToken')
                try {
                    const response = await axios.put('https://demo-domain-managment.onrender.com/editClient', 
                        newClient, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + newAuthToken 
                            }
                        }
                    )
                    setClients(prevClients => prevClients.map(client =>
                        client._id === response.data._id ? {...response.data} : client
                    ));
                    setName('')
                    setLastPaid('')
                    setExpiredAt('')
                    setDomains([])
                    setCurrentDomain('')
                    setCurrentSubdomain('')
                    setAcceptBtn(false)
                    setEditBtn(false)
                    setEditUser(true)
                } catch (error) {
                    console.log(error)         
                }
            }
    
        }

  return (
    <div className='flex w-1/2 flex-row justify-center'>
    <form className='w-full flex' onSubmit={handleSubmit}>    
        <div className='border-gray border p-4 rounded-xl flex-col flex'>
            <div className='w-full flex flex-row justify-between'>
                <h1>Edit Client</h1>
                <IconButton>
                    <CloseIcon onClick={()=>setEditBtn(false)} />  
                </IconButton>

            </div>
                <div className='flex flex-col items-start pt-4'>
                    <label className='text-theme font-semibold'>Name: </label>
                    <input className='border-gray border pl-1'
                        value={name}
                        type="text"
                        onChange={(e) => handleName(e)}
                    ></input>
                </div>
                <div className='border-gray border p-4 mt-3'>
                    <div className='flex flex-col items-start'>
                        <label className='text-theme font-semibold'>Domain: </label>
                        <input className='border-gray border pl-1'
                            type="text"
                            onChange={(e) => setCurrentDomain(e.target.value)}
                        ></input>
                    </div>
                    <div className='flex flex-row'>
                        <div className='flex flex-col items-start pt-4'>
                            <label className='text-theme font-semibold'>Last paid :</label>
                            <input className='border-gray border pl-1'
                                type="date"
                                onChange={(e) => setLastPaid(e.target.value)}
                            ></input>
                        </div>
                        <div className='flex flex-col items-start pt-4 pl-4'>
                            <label className='text-theme font-semibold'>Expired at :</label>
                            <input className='border-gray border pl-1'
                                type="date"
                                value={expiredAt}
                                onChange={(e) => setExpiredAt(e.target.value)}
                            ></input>
                        </div>   
                    </div>
                    <div className='flex flex-col items-start pt-4 mb-4'>
                        <label className='text-theme font-semibold'>Subdomain: </label>
                        <div className='flex flex-row items-center'>
                        <input className='border-gray border pl-1'
                            type="text"
                            onChange={(e) => setCurrentSubdomain(e.target.value)}
                        ></input>.{currentDomain}
                        <div className='flex'>
                            <IconButton color="primary" onClick={addSubdomains}>
                                <AddCircleIcon />
                            </IconButton>
                        </div>
                        </div>
                    </div>
                    {domains &&
                          <div className='flex bg-primary text-secondary flex-col mb-4 p-4'>
                          {domains.map((domain, index) => (
                              <div key={index}>{domain.name}
                                <IconButton color="primary" onClick={()=>deleteDomain(domain.name, false)}>
                                 <RemoveCircleIcon />
                                </IconButton>
                              <div className='ml-4'>
                                  {domain.subdomains.map((subdomain, index)=> (
                                      <div key={index}>{subdomain}
                                        <IconButton color="primary" onClick={()=>deleteDomain(domain.name, subdomain)}>
                                            <RemoveCircleIcon />
                                        </IconButton>
                                      </div>
                                  ))}
                              </div>
                              </div>
                          ))}
                      </div>

                    }
                    <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addDomain}>
                        Add Domain
                    </Button>
                </div>
                <Button variant="contained" type='submit' disabled={acceptBtn ? false : true}>
                    Accept Changes
                </Button>
        </div>
    </form>
</div>
  )
}

export default EditUser