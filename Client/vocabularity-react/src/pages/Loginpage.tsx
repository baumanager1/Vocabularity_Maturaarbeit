import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import "../styles/loginpage.scss";
import { useAuth } from '../components/Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, SubmitEvent } from 'react';

export default function Loginpage() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); 
    const {login} = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    async function credentialsLogin(event: SubmitEvent<HTMLFormElement>) {
        event?.preventDefault();

        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method:"POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if(!response.ok) {
            setLoginError("Invalid username or password")
            return;
        }

        const json = await response.json();
        login(json.token);
        navigate("/dashboard");
    }

    
    async function handleLoginSuccess(credentialResponse: CredentialResponse) {
        try {
            const response = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: credentialResponse.credential })
        });
                if(!response.ok) {
            const errorText = await response.text();
                throw new Error(`Login failed: ${errorText}`);
        }
        const json = await response.json();
        login(json.token);
        navigate("/dashboard");
        }
        catch (error) {
            console.error("Error during login:", error);
        }
        
    }
    return (
        <>

        <h1 id="login-advisory">Dear User, please login</h1>

        <div className="container-md login-container mx-auto">
            <div className='row'>
                <div className="user-login">
                    <form onSubmit={credentialsLogin}>
                        <div className="form-group mb-3">
                            <label htmlFor="usernameInput">Username</label>
                            <input 
                            type="text"
                            className='form-control'
                            id='usernameInput' 
                            placeholder='Enter username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label htmlFor="passwordInput">Password</label>
                            <input 
                            type='password' 
                            className='form-control' 
                            id='passwordInput' 
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            {loginError && (
                                <div className='text-danger mt-2'>
                                {loginError}
                                </div>
                            )}
                        </div>
                        
                        <button type='submit' className='btn btn-primary'>Login</button>
                    </form>
                </div>
            </div>

            <div className='login-separator'>
                <span>or</span>
            </div>
            <div className="row">
                <div className="col google-login mt-3">
                <GoogleLogin
                    onSuccess={(credentialResponse: CredentialResponse) => {
                        console.log(credentialResponse);
                        handleLoginSuccess(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                    width="300"
                />
                </div>
            </div>
        </div>
        </>
    )

}

