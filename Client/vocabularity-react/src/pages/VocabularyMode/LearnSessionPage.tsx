import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useState } from "react";

export default function LearnSessionPage() {
    const { user } = useAuth();
        const[answer, setAnswer] = useState("");
    
    
    return (
        <>
        {user ? (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <h1>Term</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Enter term" value={answer} onChange={(e) => setAnswer(e.target.value)}/>
                    </div>
                </div>
            </div>
        ) : (<LoginPrompt/>)}
        </>
    );
}