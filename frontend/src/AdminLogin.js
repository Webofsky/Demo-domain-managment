import {useState, useContext} from "react"
import {AuthContext} from './utils/AuthContext'
import axios from 'axios';

const AdminLogin = () => {

    const {setAuthToken, setRefreshToken, setLoginAlert} = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://demo-domain-managment.onrender.com/login', {
                login: username,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setMessage('Logged in Succesfully!')
            
            const authToken = response.data.authToken
            const refreshToken = response.data.refreshToken
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('refreshToken', refreshToken);

            setAuthToken(authToken)
            setRefreshToken(refreshToken)
            setLoginAlert(true)

        } catch (error) {
            setMessage('Login Failed. Please check your username and password.')
            console.log(error)
        }
    }

    return(
        <div className="w-screen h-screen flex flex-col-reverse md:flex-row items-center justify-around flex-wrap bg-theme">
            <div className="flex basis-1/2 justify-center">
                <div className="flex flex-col items-center justify-center w-auto h-3/4 rounded-lg bg-primary px-2 py-10 shadow-2xl text-secondary font-medium">                    
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <label className="text-theme">Login</label>
                        <input className="mt-2 rounded-lg px-2" 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}

                        /><br/>
                        <label className="text-theme">Hasło</label>
                        <input className="mt-2 rounded-lg px-2" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br/>
                        <button className="text-theme text-lg" type="submit">Login</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
            <div className="flex basis-1/2 flex-col items-center text-primary h-2/5 justify-around">
                <h1 className="text-5xl font-medium">WEB OF SKY</h1>
                <h1 className="text-4xl font-medium mt-9">Business Managment<br/>(DEMO)</h1>
                <img className="w-1/4" src='/images/logo.png' alt="logo"/>
            </div>
        </div>
    )
}

export default AdminLogin