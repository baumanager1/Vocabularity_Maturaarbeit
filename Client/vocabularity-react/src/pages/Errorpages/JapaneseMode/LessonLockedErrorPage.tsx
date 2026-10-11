import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/LessonLockedErrorPage.scss'

export default function LessonLockedErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message ?? "Please complete the previous Lesson first, to unlock this Lesson.";

    return (
        <div className="container-fluid text-center py-5">
            <h1>Error 403</h1>
            <p>{message}</p>
            <Link className="btn btn-primary homepage-btn"to="/">
                Back to Homepage
            </Link>
            <Link className='btn btn-primary japanese-btn' to="/japanese">Back to Japanese Mode</Link>

        </div>
    );
}