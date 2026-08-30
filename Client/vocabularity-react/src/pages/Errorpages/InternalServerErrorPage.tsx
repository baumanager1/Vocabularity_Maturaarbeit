import { useLocation, useNavigate } from 'react-router-dom';

export default function InternalServerErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message ?? "Something went wrong.";

    return (
        <div className="container-fluid">
            <h1>Error 500</h1>
            <p>{message}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
                Back to Homepage
            </button>
        </div>
    );
}