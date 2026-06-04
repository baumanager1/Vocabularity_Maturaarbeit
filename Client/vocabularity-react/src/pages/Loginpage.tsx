import {GoogleLogin} from '@react-oauth/google';
import "../styles/loginpage.scss";

export default function Loginpage() {
    return (
        <>
        <h1 id="login-advisory">Dear User, please login via Google</h1>
        <div className="container-md google-login-container">
            <div className="row">
                <div className="col">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
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