require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
    origin: 'https://demo.webofsky.pl',
    methods: 'GET,POST,PUT,DELETE', 
    credentials: true 
}));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err)
})

console.log('serwer')

    const Admin = mongoose.model("Admin", require('./schemas/Admin').schema);
    const Client = mongoose.model("Client", require('./schemas/Client').schema);
    const Hosting = mongoose.model("Hosting", require('./schemas/Hosting').schema);

app.post('/addclient', authenticateToken, async (req,res) => {
    const {name, domains} = req.body
    if (!name || !domains) return res.sendStatus(400)
    const client = await Client.create(req.body)
    client.save()

    res.send(client).status(201)
})

app.put('/editClient', authenticateToken, async (req, res)=> {
    try {
        const {_id } = req.body
        if (!_id) return res.sendStatus(400)
        const client = await Client.findOneAndReplace(
            { _id: req.body._id },
            req.body,
            { new: true, runValidators: true }
        );
        console.log('User has changed successfuly')
        res.send(client)
    } catch (err) {
        console.error(err)
    }

})

app.get('/clients', authenticateToken, async (req, res) => {
    const clients = await Client.find()
    return res.send(clients).status(201)
})

app.delete('/clientdelete/:id', authenticateToken, async (req,res) => {
    try {
        const clientId = req.params.id;
        const result = await Client.findByIdAndDelete(clientId);

        if (!result) {
            return res.status(404).send({ message: 'Client not found'})
        }
            res.status(200).send({ message: 'Client deleted succesfully' })
    } catch (error) {
        res.status(500).send({ message: 'Error deleting client:', error })
    }
})

//hosting

app.get('/hosting/:name', authenticateToken, async (req, res) => {
    try {
        const name = req.params.name
        const result = await Hosting.findOne({ name: name })

        if (!result) {
            return res.status(404).send({ message: 'Hosting not found' })
        }
        res.status(201).send(result)

    } catch (error) {
        res.status(404).send({ message: 'Error getting hosting data: ', error })
    }
})

//tasks

app.put('/task/:id', authenticateToken, async (req,res) => {
    try {
        const clientId = req.params.id

        const { text, cost , domain } = req.body

        const newService = {
            title: text,
            toPay: cost,    
            paid: [],
            status: false
        };

        if (!text || !cost || !domain) {
            return res.sendStatus(400)
        }

        const updatedClient = await Client.findOneAndUpdate(
            { _id: clientId, 'domains.name': domain },
            { $push: { 'domains.$.services': newService } },
            { new: true, useFindAndModify: false }
          );

          if (!updatedClient) {
            return res.status(404).send({ message: 'Client not found' })
        }
          res.status(200).send(updatedClient)
    } catch (error) {
        console.log(error)
        res.status(500).send({message: 'Error adding task: ', error})
    }
})

app.delete('/deletetask/:id', authenticateToken, async (req,res) => {
    try {
        const clientId = req.params.id
        const domainName = req.body.domain
        const serviceId = req.body.service

        if (!domainName || !serviceId) {
            return res.sendStatus(400)
        }

        const updatedClient = await Client.findOneAndUpdate(
            { _id: clientId, 'domains.name': domainName },
            { $pull: { 'domains.$.services': { _id: serviceId } } },
            { new: true, useFindAndModify: false }
          );

          if (!updatedClient) {
            return res.status(404).send({ message: 'Client not found' })
          }

        res.status(200).send(updatedClient)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error deleting client:', error })
    }
})

// tasks(payments)

app.put('/task/payment/:clientId/:domainName/:serviceId', authenticateToken, async (req, res) => {
    try {
        const  { clientId, domainName, serviceId } = req.params

        const  {text, cost} = req.body

        const paid = {
            title: text,
            installment: cost
        }

        if(!clientId || !domainName || !serviceId || !text || !cost) {
            return res.sendStatus(400)
        }

        const updatedClient = await Client.findOneAndUpdate(
            { _id: clientId, 'domains.name': domainName, 'domains.services._id': serviceId },
            { $push: { 'domains.$[domain].services.$[service].paid': paid } },
            {
                arrayFilters: [
                { 'domain.name': domainName },
                { 'service._id': serviceId }
                ],
                new: true,
                useFindAndModify: false
            }
          );
          if (!updatedClient) {
            return res.status(404).send({ message: 'Client not found' })
          }
          res.status(200).send(updatedClient)

    } catch (error) {
        res.status(500).send({message: 'Error adding task: ', error})
    }
})


//AUTHENTICATION

    function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
            req.user = user
            next()
    })
}
console.log('auth serwer')

app.post('/token', async (req,res) => {
    const user = await Admin.findOne()
    const refreshTokens = user.refreshTokens
    const refreshToken = req.body.token
    if (!refreshToken) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, data) => {
        if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({name: data.name})
            user.authTokens.push(accessToken)
            await user.save()
            res.json({authToken: accessToken})

})    
})

app.delete('/logout', async (req, res) => {
        const user = await Admin.findOne()
        await Admin.updateOne({ login: user.login}, { $pull: { refreshTokens: req.body.token }});
        res.sendStatus(204)
})

app.post('/login',async  (req, res) =>  {
    const user = await Admin.findOne({login: req.body.login})
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
       if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken =  generateAccessToken({name: user.name})
        const refreshToken = jwt.sign({name: user.name}, process.env.REFRESH_TOKEN_SECRET)

        user.authTokens.push(accessToken)
        user.refreshTokens.push(refreshToken)

        await user.save()

        res.json({authToken:accessToken, refreshToken:refreshToken})

       } else {
        res.status(401).send('Not Allowed')
       }

    }catch (err) {
        res.status(500).send(err)
    }
})

    function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
    }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });