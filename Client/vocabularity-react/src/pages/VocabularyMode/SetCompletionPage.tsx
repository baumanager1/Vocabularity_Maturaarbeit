import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useAuth } from  "../../components/Authentication/AuthContext";
import { useNavigate, useNavigation } from "react-router-dom";
import "./styles/SetCompletionPage.scss";
import CompletionAnimation from "../../components/Animations/CompletionAnimation";
type SetCompletionPageProps = {  
    completionMessage?: string,
    buttonLink? : string,
    buttonMessage? : string
}

export default function SetCompletionPage({
    completionMessage= "Great job! You have learned all the words in this vocabulary set.", 
    buttonLink = "/learn",
    buttonMessage = "Back to the Learnhub", 
}: SetCompletionPageProps) {
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
                    <p id="completion-message">{completionMessage} </p>
                    <button id="back-button" className="btn btn-primary" onClick={() => navigate(buttonLink)}>{buttonMessage}</button>
                </div>

            </>
        )  : (<LoginPrompt/>)}
        </>
    );
}