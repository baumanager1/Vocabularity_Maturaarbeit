import { Link } from "react-router-dom";
import "./styles/NotFoundErrorPage.scss"
export default function NotFoundErrorPage() {
    return (
        <div className="container text-center">
            <h1 className="display-1">404</h1>
            <p className="text-muted error-message">The page you were looking for doesn't exist.</p>
            <Link to="/learn" className="btn btn-primary learn-btn">Back to Learnhub</Link>

            <Link to="/" className="btn btn-primary homepage-btn">Back to Homepage</Link>
        </div>
    )
}