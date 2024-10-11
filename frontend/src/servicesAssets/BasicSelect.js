import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const BasicSelect = ({clients, setCurrentClient, setCurrentDomain}) => {

  console.log(clients)
    const handleChange = (event) => {
      const value = event.target.value
      const [clientId, domainName] = value.split('~')
      setCurrentDomain(domainName);
      setCurrentClient(clientId)
    };

  return (
    <div className='flex flex-1'>
        <Box sx={{ minWidth: 120}}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Domain</InputLabel>
            <Select
            label="Domain"
            onChange={handleChange}
            >
            { clients && clients.map(client=>(
              client.domains.map((domain, index) => (
                  <MenuItem key={`${client._id}-${index}`} value={`${client._id}~${domain.name}`}>{domain.name}</MenuItem>
                )
              )
            )
            )}
            </Select>
        </FormControl>
        </Box>
    </div>
  )
}

export default BasicSelect