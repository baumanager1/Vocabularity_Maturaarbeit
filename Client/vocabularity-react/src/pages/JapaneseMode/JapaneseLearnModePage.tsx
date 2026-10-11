import LoginPrompt from "../../components/Authentication/LoginPrompt"
import { replace, useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import type { LearnVocabSet, Word } from "../../models/VocabularyMode/LearnVocabSet";
import getLanguageName from "../../models/VocabularyMode/Languagepair";
import shuffleArray from "../../utils/shuffleArray";
import reinsertWord from "../../utils/reinsertWord";
import normalizeAnswer from "../../utils/normalizeAnswer";
import JapaneseLesson, { JapaneseLearnMode } from "../../models/JapaneseMode/JapaneseLesson";
import type { ChangeEvent, SubmitEvent } from "react";
import "./styles/JapaneseLearnModePage.scss"
import { kanaParser, KanaType } from "../../utils/kanaParser";
import SetCompletionPage from "../VocabularyMode/SetCompletionPage";




export default function JapaneseLearnModePage() {
    const { user } = useAuth();
    const[answer, setAnswer] = useState("");
    const { japaneseLessonId } =useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<JapaneseLesson>()
    const [finished, setFinished] = useState(false);
    const [askedQuestion, setAskedQuestion] = useState<JapaneseQuestion>();
    const [correctionMode, setCorrectionMode] = useState(false);
    const answerInputRef = useRef<HTMLInputElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [questions,setQuestions] = useState<JapaneseQuestion[]>([]);

    
    const [correctModes, setCorrectModes] = useState<Record<string, {meaning: boolean, reading: boolean}>>({});

    type JapaneseQuestion = | {
        type : "kanji",
        id : number,
        item: JapaneseLearnMode["kanji"],
        mode: "reading" | "meaning";
    }
    | {
        type : "japaneseVocabulary",
        id : number,
        item : JapaneseLearnMode["japaneseVocabulary"],
        mode:  "reading" | "meaning";
    }

 
   
   async function submitAnswer(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!correctionMode) {
            if(!askedQuestion) return;
            const result = checkAnswer(askedQuestion?.mode, askedQuestion?.item, answer);
            setIsCorrect(result.isCorrect);
            setCorrectAnswers(result.correctAnswers);
            setCorrectionMode(true);

                if(result.isCorrect) {
                    const key = `${askedQuestion.type}-${askedQuestion.id}`;
                    setCorrectModes(prev => {
                        const existing = prev[key] ?? {meaning : false, reading : false};
                        return{
                                ...prev,
                            [key]: {
                                ...existing,
                                [askedQuestion.mode] : true,
                            },
                        };
                      
                    });

                setQuestions((prevItems) => prevItems.slice(1));
                const token = localStorage.getItem('jwt');
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/api/japanese/item/${askedQuestion.id}/type/${askedQuestion.type}/mode/${askedQuestion.mode}/learn-state`, {

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
                setQuestions((prevItems) => {
                    const current = prevItems[0];
                    const remaining = prevItems.slice(1);
                    return reinsertWord(remaining, current, 7, 15);
                });
            }
        } 

        else {
            setAnswer("");
            setCorrectionMode(false);
            const next = questions[0]
            if(!next) {
                setFinished(true);
            } else {
                setAskedQuestion(next)
            }
        }
    }

    function checkAnswer(answerMode: "reading" | "meaning", item :JapaneseLearnMode["kanji"] | JapaneseLearnMode["japaneseVocabulary"], answer: string) : {isCorrect : boolean, correctAnswers: string[]} {
        
        const mode = `${answerMode}s` as "readings" | "meanings"

        const possibleAnswers = item[mode];

        const correctAnswers : string[] = possibleAnswers
        .filter(solution => solution.acceptedAnswer)
        .map (solution => 
            "meaning" in solution
            ? solution.meaning
            : solution.reading
        );
        const isCorrect = correctAnswers.some( solution => normalizeAnswer(solution) === normalizeAnswer(answer)
        );

        return {isCorrect, correctAnswers};
    }

     useEffect(() => {
            const apiUrl = import.meta.env.VITE_API_URL;
            const token = localStorage.getItem('jwt');

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
                        navigate("/errors/lessonLocked", {replace: true})
                        return;
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
                        navigate("/404", {replace : true});
                        return
                    }
                    console.error("Request failed:", response.status);
                    return;
                }
                const data : JapaneseLesson = await response.json();
                setLesson(data);
                data.kanjis = shuffleArray(data.kanjis);
                data.vocabulary = shuffleArray(data.vocabulary);

                const kanjiQuestions: JapaneseQuestion[] = data.kanjis.flatMap(kanji => [
                    {
                        type: "kanji",
                        item : kanji,
                        id : kanji.kanjiId,
                        mode : "meaning"
                    }, {
                        type : "kanji",
                        item : kanji,
                        id: kanji.kanjiId,
                        mode : "reading"
                    }
                ]);

                 const vocabularyQuestions : JapaneseQuestion[] = data.vocabulary.flatMap(japaneseVoabulary => [
                    {
                        type: "japaneseVocabulary",
                        item : japaneseVoabulary,
                        id : japaneseVoabulary.vocabularyId,
                        mode : "meaning"
                    }, {
                        type : "japaneseVocabulary",
                        item : japaneseVoabulary,
                        id : japaneseVoabulary.vocabularyId,
                        mode : "reading"
                    }
                ]);
                const allQuestions: JapaneseQuestion[] = [
                    ...kanjiQuestions,
                    ...vocabularyQuestions
                ];

                const shuffledQuestions = shuffleArray(allQuestions)

                setQuestions(shuffledQuestions)
                setAskedQuestion(shuffledQuestions[0]);
                setTotalItems(data.kanjis.length + data.vocabulary.length)
            }
             catch (error) {
                    console.error("Error fetching vocabset:", error);
                    return;
                }
            }
    
            fetchJapaneseLesson();
        }, [japaneseLessonId]);
    
        useEffect(() => {
            if(correctionMode) {
                submitButtonRef.current?.focus();
            }
            else {
                answerInputRef.current?.focus();
            }
        }, [correctionMode]);
    

   const completedItems = Object.values(correctModes)
        .filter(m => m.meaning && m.reading).length;

    
    const progress = totalItems > 0
        ? (completedItems / totalItems) * 100
        : 0;

    function onAnswerInput(e : ChangeEvent<HTMLInputElement>) {
        if(askedQuestion?.mode === "reading") {
            const convertedAnswer = kanaParser.parseRomajiToKana(e.target.value, KanaType.HIRAGANA)
                    setAnswer(convertedAnswer);
            }
            else {
                setAnswer(e.target.value)
            }
    }

    if(!user) return <LoginPrompt title="Learn Japanese" message="Sign in to study Japanese kanji and vocabulary." />;

    if(finished) {
        return (
            <SetCompletionPage 
            completionMessage={`You learnt all ${totalItems} items.`}
            buttonLink="/japanese"
            buttonMessage= "Back to the Japanese Hub"
            />
        )
    }

    return (
        <>
            {askedQuestion && (
                <div className="container-fluid japanese-learn-container py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Lesson {lesson?.lessonNumber}</h2>
                    
                        <span className="badge bg-primary">
                            {`Items ${completedItems} / ${totalItems}`}
                        </span>
                    </div>

                    <div className="progress mb-4">
                        <div
                        className="progress-bar"
                        style={{width : `${progress}%`}}></div>
                    </div>

                    <div className="card learn-card shadow-sm">
                        <div className="card-body p-4">

                            <h1 className={`learn-term ${askedQuestion.type}`}>
                                {askedQuestion.type === "kanji"
                                    ? askedQuestion?.item.character
                                    : askedQuestion?.item.word
                                }
                            </h1>
                            <form onSubmit={submitAnswer} className="learn-answer-section" autoComplete="off">
                                {!correctionMode ? (
                                    <div>
                                        <label
                                        htmlFor="answer-field"
                                        className="form-label text-capitalize input-advisory">
                                            Enter {askedQuestion.mode}
                                        </label>

                                        <input
                                            type="text"
                                            id="answer-field"
                                            ref={answerInputRef}
                                            className="form-control form-control-lg"
                                            placeholder={
                                                askedQuestion.mode === "meaning"
                                                ? "Your answer..."
                                                : "答え"
                                            }
                                            value={answer}
                                            onChange={onAnswerInput}
                                            
                                        />
                                    </div>
                                    ) : (
                                        <div className="text-center">
                                            {
                                                isCorrect ? (
                                                    <p className="text-success">Correct</p>
                                                ) : (
                                                    <>
                                                        <p className="text-danger">Incorrect.</p>
                                                        <p>{askedQuestion.mode === "meaning"

                                                        ?  correctAnswers.length >1 ?
                                                            "Correct meanings: " : "Correct meaning: "
                                                        : correctAnswers.length >1 ?
                                                        "Correct readings" : "Correct reading: "        
                                                        } {correctAnswers.join(", ")} </p>
                                                    </>
                                                )}
                                        </div>
                                    )}

                                    <button
                                    type="submit"
                                    ref={submitButtonRef}
                                    className="btn btn-primary"
                                    >
                                        {correctionMode ? "Next Question" : "Submit Answer"}
                                    </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}