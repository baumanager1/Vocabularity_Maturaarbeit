import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";


export default function Learnhub() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
        {user ? (
            <h1 id="lernpage-message">Let's learn, {user.username}!</h1>
        ) : (<LoginPrompt/>)}
        </>
    );
}