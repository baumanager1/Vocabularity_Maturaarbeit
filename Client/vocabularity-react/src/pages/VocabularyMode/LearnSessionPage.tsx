import { replace, useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./styles/LearnSessionPage.scss";
import type { LearnVocabSet, Word } from "../../models/VocabularyMode/LearnVocabSet";
import getLanguageName from "../../models/VocabularyMode/Languagepair";
import shuffleArray from "../../utils/shuffleArray";
import reinsertWord from "../../utils/reinsertWord";
import normalizeAnswer from "../../utils/normalizeAnswer";
import SetCompletionPage from "./SetCompletionPage";
export default function LearnSessionPage() {
    const { user } = useAuth();
        const[answer, setAnswer] = useState("");
    const { vocabsetid } =useParams();
    const navigate = useNavigate();
    const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    
    const[answerLanguage, setAnswerLanguage] = useState("");
    const [learnSessionItems, setLearnSessionItems] = useState<Word[]>([]);
    const [askedWord, setAskedWord] = useState("Term");
    const [correctionMode, setCorrectionMode] = useState(false);
    const answerInputRef = useRef<HTMLInputElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [finished, setFinished] = useState(false);

    function submitAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        checkAnswer();
    }

    async function checkAnswer() {
        console.log("Checking answer:", answer);

        if (learnSessionItems.length === 0) {
            setFinished(true)
              return;
        }

        if(!correctionMode) {
            setCorrectionMode(true);
            const currentWord = learnSessionItems[0];
            setCorrectAnswer(currentWord.definition);
            const correct = normalizeAnswer(currentWord.definition) === normalizeAnswer(answer);
            setIsCorrect(correct);
            
            if(correct) {
                // correct answer
                setLearnSessionItems((prevItems) => prevItems.slice(1));
                const token = localStorage.getItem('jwt');
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/api/learnmode/vocabset/${vocabsetid}/words/${currentWord.id}/learn-state`, {
                    method: "PATCH",
                    headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        learnState: true
                    })
                })
                
                if (!response.ok) {
                    const data = await response.json();
                    console.error(response.status, data);
                }

                else {
                     console.log("Learn state updated successfully");
                }
            }
            else {
                // incorrect answer
                setLearnSessionItems((prevItems) => {
                    const current = prevItems[0];
                    const remaining = prevItems.slice(1);
                    return reinsertWord(remaining, current, 7, 15);
                });
            }
        }
        
        else {
            const next = learnSessionItems[0];
            if(!next) {
                setFinished(true);
                return;
            }
            setAskedWord(next.term);
            setAnswer("");
            // load next Question
            setCorrectionMode(false);
        }
    }

    useEffect(() => {

        if(!vocabsetid || !GUID_REGEX.test(vocabsetid)) {
            navigate ("/404", {replace : true})
        }
        
        async function fetchVocabset() {
            try {
                const token = localStorage.getItem('jwt');
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/api/learnmode/vocabset/` + vocabsetid, {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                });

            console.log("Status:", response.status);
            if (!response.ok) {
                if(response.status === 404 || response.status === 400) {
                    navigate("/404", {replace : true});
                    return
                }
                console.error("Request failed:", response.status);
                return;
            }
            const data :LearnVocabSet = await response.json();
            setAnswerLanguage(getLanguageName(data.definitionLanguage));
            const shuffledWords = shuffleArray(data.words);
            setLearnSessionItems(shuffledWords);
            setAskedWord(shuffledWords[0]?.term || "Term");

            

            }
            catch (error) {
                console.error("Error fetching vocabset:", error);
                return;
            }
        }

        fetchVocabset();
    }, [vocabsetid]);

    useEffect(() => {
        if(correctionMode) {
            submitButtonRef.current?.focus();
        }
        else {
            answerInputRef.current?.focus();
        }
    }, [correctionMode]);

    if(!user) return <LoginPrompt />

    if (finished) return <SetCompletionPage />;
    return (
        <>
            <div className="container-fluid learn-session-container">
                <div className="row term-row">
                    <div className="col d-flex justify-content-center">
                        <div className="col-md-4 mb-3 mx-auto">
                            <h1 id="term">{askedWord}</h1>
                        </div>
                    </div>
                </div>

                
                <div className="row">
                    <div className="col d-flex justify-content-center answerfield-col">
                        <div className="col-md-4 mb-3 mx-auto">
                            <form onSubmit={submitAnswer} autoComplete="off">
                                <div className="answer-section">
                                    <div className="form-floating learn-floating">
                                    {!correctionMode ? (
                                        <>

                                            <input type="text"
                                            ref={answerInputRef}
                                            id="answer-field"
                                            className="form-control" 
                                            placeholder="Enter term" 
                                            value={answer} 
                                            onChange={(e) => setAnswer(e.target.value)}
                                            />


                                            <label htmlFor="answer-field">
                                                {answerLanguage !== "" 
                                                    ? "Enter your answer in " + answerLanguage 
                                                    : "Enter Answer"}
                                                </label>
                                        </>
                                    ): (
                                        <>
                                            <div className="correction-section">
                                                {isCorrect ? ( 
                                                    <p id="correct-message">Correct!</p>
                                                ) : (
                                                    <>
                                                        <p id="incorrect-message">Incorrect.</p>
                                                        <p id="correct-answer-message">Correct answer: {correctAnswer}</p>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    </div>

                                    <button 
                                        ref={submitButtonRef}
                                        type="submit" 
                                        className="btn btn-primary"
                                    >
                                        {correctionMode ? "Next Question" : "Answer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row -">
                    <div className="col d-flex justify-content-center answerbutton-col">
                        <div className="col-md-4 mb-3 mx-auto">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
