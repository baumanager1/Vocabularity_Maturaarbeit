import { useNavigate } from "react-router-dom";

function LoginPrompt({ title = "Homepage"}) {
    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <div className="row">
                <h1>{title}</h1>
            </div>
            <div className="row login-prompt">
                <h1 id="login-prompt">"Dear User, please login to continue"</h1>
            </div>
            <div className="row login-button">
                <div className="col d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => navigate("/login")}>
                        "Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPrompt;