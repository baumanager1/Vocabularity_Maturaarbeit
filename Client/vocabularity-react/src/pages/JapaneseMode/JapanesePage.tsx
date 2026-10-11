import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { Link } from "react-router-dom";
import { JapaneseLessonSummary } from "../../models/JapaneseMode/JapaneseLesson";


export default function JapanesePage() {
    const { user } = useAuth();
    const [japaneseLessons, setJapaneseLessons] = useState<JapaneseLessonSummary[]>([]);
    const[unlockStatus, setUnlockStatus] = useState<Record<string, boolean>>({});

useEffect(() =>{

    if(japaneseLessons.length === 0) return
        async function fetchUnlockStatus() {
                const token = localStorage.getItem("jwt")
                const apiUrl = import.meta.env.VITE_API_URL;

                const results = await Promise.all(
                    japaneseLessons.map(async lesson => {
                    if (lesson.lessonNumber === 1) {
                        return {lessonId : lesson.lessonId, unlocked : true};
                    }

                    const response = await fetch(
                        `${apiUrl}/api/japanese/lesson/${lesson.lessonId}/progress`,
                        {
                            headers : { Authorization : "Bearer " + token}
                        }
                    );

                    return { lessonId: lesson.lessonId, unlocked : response.ok};
                    })
                );

            setUnlockStatus(
                Object.fromEntries(results.map(r => [r.lessonId, r.unlocked]))
            );

        }

    fetchUnlockStatus();
}, [japaneseLessons]);
 
useEffect(() => {
    async function loadJapaneseLessons() {
        const token = localStorage.getItem("jwt")
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/japanese/lessons`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        if (response.status === 204) {
            console.log("No Japanese Lessons");
            return;
        }

        if (response.ok) {
            const data = await response.json();
            setJapaneseLessons(data)
        }
    }
    loadJapaneseLessons();
}, []);

    return (
        <>
            {user ? (
                <div className="container-fluid learn-hub-container">
                    <div className="container-fluid learn-hub-messages">
                        <h1 id="lernpage-message">おかえりなさい, {user.username}!</h1>
                    </div>
                    <div className="container-fluid learn-hub-vocabsets">
                        <div className="row g-4 vocabulary-set-row">
                            {japaneseLessons.map(japaneseLesson => {
                                const isUnlocked =unlockStatus[japaneseLesson.lessonId] ?? false;

                                return (
                                    <div
                                        className="col-12 col-md-6 col-lg-4"
                                        key={japaneseLesson.lessonId}
                                    >
                                        <div className="card" style={{ width: "18rem" }}>
                                            <div className="card-body">
                                                <h5 className="card-title">Lesson
                                                    {japaneseLesson.lessonNumber}
                                                </h5>

                                                {isUnlocked ? (
                                                    <>
                                                    <div className="d-flex justify-content-center gap-3">
                                                        <Link
                                                            to={`/japanese/study/lesson/${japaneseLesson.lessonId}`}
                                                            className="btn btn-primary"
                                                        >
                                                            Study Mode
                                                        </Link>


                                                        <Link
                                                            to={`/japanese/learn/lesson/${japaneseLesson.lessonId}`}
                                                            className="btn btn-primary"
                                                        >
                                                            Learn Mode
                                                        </Link>
                                                                                                                
                                                    </div>
                                                    </>
                                                    
                                                ) : (
                                                    <button
                                                        className="btn btn-secondary" disabled>
                                                        🔒 Locked
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <LoginPrompt
                title="Learn Japanese" 
                message="Sign in to study Japanese kanji and vocabulary."/>
            )}
        </>
    );
}

