import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import "./styles/LearnHubPage.scss"
import {VocabularySetSummary} from "../../models/LearningMode/VocabularySet";


export default function Learnhub() {
    const { user } = useAuth();
    const [vocabSets, setVocabSets] = useState<VocabularySetSummary[]>([]);
    const token = localStorage.getItem("jwt")

    useEffect(() => {
        async function loadVocabSets() {
            const response = await fetch("https://localhost:7112/api/learnmode/vocabset/all-sets",
                {
                    method: "GET",
                    headers :{
                        Authorization: "Bearer " + token
                    }
                }
            );

            if(response.status === 204) {
                console.log("No Vocabulary sets");
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setVocabSets(data)
            }
        }
            loadVocabSets();
        }, []);

    return (
        <>
        {user ? (
            <div className="container-fluid learn-hub-container">
                <div className="container-fluid learn-hub-messages">
                    <h1 id="lernpage-message">Let's learn, {user.username}!</h1>
                    <h2 id="vocabulary-sets-message">VocabularySets</h2>
                </div>
                <div className="container-fluid learn-hub-vocabsets">
                    <div className="row g-4 vocabulary-set-row">
                        {vocabSets.map(vocabSet => (
                            <div 
                                className="col-12 col-md-6 col-lg-4"
                                key={vocabSet.vocabularySetId}
                                >
                                    <div className="card" style={{width: "18rem;"}}>
                                        <div className="card-body">
                                            <h5 className="card-title">{vocabSet.title}</h5>
                                            <p className="card-text">{vocabSet.description}</p>
                                            <Link
                                                to={`/learn/vocabset/${vocabSet.vocabularySetId}`}
                                                className="btn btn-primary"
                                                >
                                                    Learn
                                                </Link>
                                        </div>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (<LoginPrompt/>)}
        </>
    );
}