import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";


export default function JapanesePage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
        {user ? (
            <h1 id="Japanese-message">おかえりなさい, {user.username}!</h1>
        ) : (
            <>
            <div className ="container-fluid">
                <div className="row">
                    <h1>Homepage</h1>
                </div>
                <div className="row login-prompt">   
                      <h1 id="login-prompt">Dear User, please login to continue</h1>
                </div>
                <div className="row login-button">
                    <div className="col d-flex justify-content-center">
                        <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
                    </div>
                </div>
            </div>
           
          
            </>
        )}
        </>
    );
}