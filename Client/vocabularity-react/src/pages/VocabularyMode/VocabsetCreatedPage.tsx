import { useNavigate } from "react-router-dom"


export default function VocabsetCreatedPage() {
    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <h1>The Vocabulary Set has been successfully created</h1>
            <button className="btn btn-primary" onClick={() => navigate('/learn')}>
                Back to Learnhub
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
                Back to Homepage
            </button>
            
        </div>
    )
}