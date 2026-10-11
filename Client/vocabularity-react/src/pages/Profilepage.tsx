import { useEffect } from "react"
import { useAuth } from "../components/Authentication/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() { 
    const {user, logout} = useAuth();
    const navigate = useNavigate();

     return (
        <>
        {user ? (
               <div className ="container-fluid">
            <div className="row">
                <h1>Profile Page</h1>
            </div>
            <div className="row login-prompt">   
                    <h1 id="login-prompt">Click here to sign out</h1>
            </div>
            <div className="row login-button">
                <div className="col d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => logout()}>Sign out</button>
                </div>
            </div>
        </div>
        ) : (null)
        } 
        </>
     );
}