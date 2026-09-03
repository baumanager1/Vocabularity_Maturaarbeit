import { useContext } from "react";
import { useAuth } from "../components/Authentication/AuthContext";
import "../styles/homepage.scss";
import { useNavigate } from "react-router-dom";
import LoginPrompt from "../components/Authentication/LoginPrompt";
export default function Homepage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <>
        {user ? (
            <h1 id="welcome-message">Continue where you left off, {user.username}!</h1>
        ) : (
            <LoginPrompt title="Homepage" />
        )}
        </>
    );
}