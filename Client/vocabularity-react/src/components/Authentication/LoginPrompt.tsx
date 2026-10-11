import { Link } from "react-router-dom";

interface LoginPromptProps {
    title?: string
    message? : string
}

export default function LoginPrompt(  
    { 
        title = "Welcome to Vocabularity",
        message = "Please sign in to continue"
    }: LoginPromptProps
) {
    return (
        <div className="container-fluid">
            <div className="row">
                <h1>{title}</h1>
            </div>
            <div className="row login-prompt">
                <h1 id="login-prompt" style={{fontSize: "40px", textAlign: "center"}}>{message}</h1>
            </div>
            <div className="row login-button">
                <div className="col d-flex justify-content-center">
                    <Link 
                    className="btn btn-primary"
                    to="/login"
                    >
                        Log in 
                    </Link>
                </div>
            </div>
        </div>
    );
}

