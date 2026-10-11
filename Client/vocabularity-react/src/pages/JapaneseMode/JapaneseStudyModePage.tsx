import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import JapaneseLesson from "../../models/JapaneseMode/JapaneseLesson";
import { useAuth } from "../../components/Authentication/AuthContext";

import "./styles/JapaneseStudyModePage.scss";
import LoginPrompt from "../../components/Authentication/LoginPrompt";

export default function JapaneseStudyModePage() {
        const { japaneseLessonId } = useParams();
        const navigate = useNavigate();
        const { user } = useAuth();

        const [lesson, setLesson] = useState<JapaneseLesson>()

        const [currentIndex, setCurrentIndex] =useState(0);

        const [studySection, setStudySection] = useState<"kanji" | "vocabulary">("kanji");

        const currentKanji = studySection === "kanji"
        ? lesson?.kanjis[currentIndex]
        : undefined
        
        const currentVocabulary = studySection === "vocabulary"
        ? lesson?.vocabulary[currentIndex]
        : undefined

        const currentItem = studySection === "kanji" 
        ? currentKanji
        : currentVocabulary

        const totalItems = studySection === "kanji"
        ? lesson?.kanjis.length ?? 0
        : lesson?.vocabulary.length ?? 0;
        

        const progress = totalItems > 0
        ? ((currentIndex +1) / totalItems) * 100 : 0;

        const apiUrl = import.meta.env.VITE_API_URL;
        
        const token = localStorage.getItem('jwt');

            useEffect(() => {
                const apiUrl = import.meta.env.VITE_API_URL;

                async function fetchJapaneseLesson() {
                    try {

                    const lockResponse = await fetch(
                        `${apiUrl}/api/japanese/lesson/${japaneseLessonId}/progress`,
                        {
                            headers : { Authorization : "Bearer " + token}
                        }
                    );

                    if(!lockResponse.ok)
                    {
                        navigate("/errors/lessonLocked")
                    }
                        const response = await fetch(`${apiUrl}/api/japanese/lesson/` + japaneseLessonId, {
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + token,
                            },
                        });
        
                    console.log("Status:", response.status);
        
                    if (!response.ok) {
                        if(response.status === 404) {
                            navigate("/404");
                            return
                        }
                        console.error("Request failed:", response.status);
                        return;
                    }
                    const data : JapaneseLesson = await response.json();
                  //  const shuffledSessionItems = shuffleArray(data.words);
                    setLesson(data);
                 //   setAskedWord(shuffledWords[0]?.term || "Term");
        
                    
        
                }
                catch (error) {
                    console.error("Error fetching japanese lesson:", error);
                    return;
                }
            }
        
                fetchJapaneseLesson();
            }, [japaneseLessonId]);

            async function handleNext() {

                if(currentIndex < totalItems -1) {
                    setCurrentIndex( i => i + 1)
                }
                else if(studySection === "kanji") {
                    console.log("Set to Vocabulary Section");
                    setStudySection("vocabulary");
                    setCurrentIndex(0);
                }
                else {
                    navigate(`/japanese/learn/lesson/${japaneseLessonId}`)
                }

                if(studySection === "kanji") {


                    const response = await fetch(`${apiUrl}/api/japanese/item/${currentKanji?.kanjiId}/type/${studySection}/study-state`, {

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
            else if(studySection === "vocabulary"){
                
                    const response = await fetch(`${apiUrl}/api/japanese/item/${currentVocabulary?.vocabularyId}/type/${studySection}/study-state`, {

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

        }

            function handlePrevious() {
                console.log("currentIndex: " + currentIndex)

                    if(currentIndex > 0 ) {
                    setCurrentIndex( i => i - 1)
                }
                else if(studySection === "vocabulary") {
                    console.log("Set to Kanji Section")
                    setStudySection("kanji")
                    setCurrentIndex((lesson?.kanjis?.length ?? 1) -1);
                }
            }
            if(!user) return <LoginPrompt title = "Learn Japanese" message = "Sign in to study Japanese kanji and vocabulary." />

        return(
            <>
                {currentItem ? (
                    <div className="container fluid japanese-lesson-container py-5">


                        <div className="d-flex justify-content-between align-items-center mb3">
                            <h2>Lesson {lesson?.lessonNumber}</h2>
                        
                            <span className="badge bg-primary">
                                {studySection === "kanji"
                                    ?   `Kanji ${currentIndex +1} / ${totalItems} `
                                    :   `Word ${currentIndex +1} / ${totalItems}`
                                }
                            </span>
                        </div>

                        <div className="progress mb-4">
                            <div
                            className="progress-bar"
                            style={{width : `${progress}%`}}></div>
                        </div>

                        <div className="card study-card shadow-sm">
                            <div className="card-body p-4">

                                <h1 className={`study-term ${studySection === "kanji" ? "kanji" : "vocabulary"}`}>
                                    {studySection === "kanji"
                                        ?currentKanji?.character
                                        : currentVocabulary?.word
                                    }
                                </h1>

                                <hr />
                            
                            <div className="row g-4">

                                <div className="col-md-6">
                                    <h4>Meaning</h4>

                                    <div className="d-flex flex-wrap gap-2">
                                        {currentItem.meanings.map((meaning, index) => (
                                            <span
                                                key={index}
                                                className="meaning-badge"
                                            >
                                                {meaning.meaning}   
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-6">
                                    <h4>Readings</h4>

                                    {currentItem.readings.map((reading, index) => (
                                        <div key={index} className="reading-item">
                                            <span className="reading-text">
                                                {reading.reading}
                                            </span>
                                            {"readingType" in reading  && (
                                                <span className="reading-type">
                                                    {reading.readingType}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-primary btm-outline-primary"
                            onClick={handlePrevious}
                            disabled={currentIndex == 0 && studySection === "kanji"}

                            >
                                {studySection === "vocabulary" && currentIndex === 0
                                    ? "Go Back to Kanji"
                                   : "Previous"
                                }
                            </button>

                            <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            >
                                {studySection === "kanji" && currentIndex === totalItems -1
                                    ? "Continue to Vocabulary"
                                    : studySection === "vocabulary" &&currentIndex === totalItems -1 
                                        ? "Enter Learnmode" 
                                        : "Next"
                                }

                            </button>
                    </div>
                </div>

            ) : (
                <p>Loading Lesson...</p>
            )}
        </>
    );
}