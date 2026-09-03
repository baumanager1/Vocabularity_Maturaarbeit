import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import "../styles/loginpage.scss";
import { useAuth } from '../components/Authentication/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Loginpage() {
    const navigate = useNavigate(); 
    const {login} = useAuth();
    return (
        <>
        <h1 id="login-advisory">Dear User, please login via Google</h1>
        <div className="container-md google-login-container">
            <div className="row">
                <div className="col">
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

    async function handleLoginSuccess(credentialResponse: CredentialResponse) {
        try {
            const response = await fetch("https://vocabularity.site/api/auth/google", {
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
}

