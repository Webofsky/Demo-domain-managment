import * as React from 'react';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export default function AccordionUsage({ clients, setClients, setEditBtn, setAddNewBtn }) {

  const {getNewToken} = useContext(AuthContext)

    const checkDate = (exp_date) => {
        const today = new Date()
        const expirationDate = new Date(exp_date)

        const differenceInTime = expirationDate.getTime() - today.getTime();

        const differenceInDays = Math.ceil(differenceInTime/(1000* 3600 * 24))

        if (differenceInDays <=7) {
            return true
        } else return false
    }

    const deleteClient = async (client) => {
        const clientId = client._id

        const authToken = localStorage.getItem('authToken')
        const refreshToken = localStorage.getItem('refreshToken')

        try {
          const response = await axios.delete(`https://demo-domain-managment.onrender.com/clientdelete/${clientId}`,
            {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + authToken 
              }
          }
          )
          setClients(prevClients => prevClients.filter(client => client._id !== clientId))
          console.log(response.data)
          
        } catch (error) {
          console.error('Error deleting client:', error)
          await getNewToken(refreshToken)
          const newAuthToken = localStorage.getItem('authToken')
          try {
            const response = await axios.delete(`https://demo-domain-managment.onrender.com/clientdelete/${clientId}`,
              {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + newAuthToken 
                }
            }
            )
            setClients(prevClients => prevClients.filter(client => client._id !== clientId))
            console.log(response.data)
            
          } catch (error) {
            console.error('Error deleting client:', error)
          }
        }
    }

    const editClient = (client) => {
      setEditBtn(client)
      setAddNewBtn(false)
    }
   
  return (
    <div>
        {clients.map((client, index) => (
            <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <h1 className='text-theme text-xl font-semibold'>{client.name}</h1>
            </AccordionSummary>
            <AccordionDetails>

                <hr></hr>
                <hr></hr>
                <h1 className='pt-4'>Domains :</h1>
                <div className='flex flex-row items-start'>
                    {client.domains.map((domain, index) => (
                        <div className='px-4' key={index}>
                            <h1 className='font-semibold text-xl'>{domain.name}</h1>
                        <h1>Last paid : {new Date(domain.lastPaid).toLocaleDateString()}</h1>
                        <div className='flex flex-row items-center'>
                            <h1 className='pr-1'>Expired at : {new Date(domain.expiredAt).toLocaleDateString()}</h1>
                            {checkDate(domain.expiredAt) && <WarningAmberIcon sx={{ color: 'orange' }}/>}
                        </div>
                            <div className='pt-4 flex flex-col'>
                                {domain.subdomains.length > 0 && <h1>Subdomains :</h1>}
                                {domain.subdomains.map((subdomain, index) => (
                                    <div key={index}>
                                        <h1 className='font-semibold text-l'>{subdomain}</h1>
                                    </div>
                                ))}
                            </div>      
                        </div>
                    ))}
                </div>
            </AccordionDetails>
            <AccordionActions>
              <Button>Services</Button>
              <Button onClick={()=>editClient(client)}>Edit</Button>
              <IconButton color='primary' onClick={()=>deleteClient(client)}>
                <DeleteIcon/>
              </IconButton>
            </AccordionActions>
          </Accordion>
        ))}
    </div>
  );
}