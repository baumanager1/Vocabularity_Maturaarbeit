import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useAuth } from  "../../components/Authentication/AuthContext";
import { useNavigate, useNavigation } from "react-router-dom";
import "./styles/SetCompletionPage.scss";
import CompletionAnimation from "../../components/Animations/CompletionAnimation";


export default function SetCompletionPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    return (
        <>
        {user ? (
            <>
                <div className="confetti-animation">
                        <CompletionAnimation/>
                </div>
                <div className="completion-container">
                    <h1>Set Completion</h1>
                    <p id="completion-message">Great job! You have learned all the words in this vocabulary set.</p>
                    <button id="back-button" className="btn btn-primary" onClick={() => navigate("/learn")}>Back to Learnhub</button>
                </div>

            </>
        )  : (<LoginPrompt/>)}
        </>
    );
}