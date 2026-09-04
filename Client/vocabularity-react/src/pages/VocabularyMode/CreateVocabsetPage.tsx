import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useState, useRef } from 'react';
import { learningLanguages, LanguageType, LanguagePair, LearningLanguages } from "../../models/LearningMode/Languagepair";
import getLanguageName from "../../models/LearningMode/Languagepair";
import "./styles/CreateVocabsetPage.scss";
import  VocabularyCard from "../../models/LearningMode/VocabularyCard";
import VocabularySet from "../../models/LearningMode/VocabularySet";

export default function CreateVocabsetPage({}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const[cards,  setCards] = useState<VocabularyCard[]>(
        Array .from(
        { length: 3 }, 
        (_, index) => new VocabularyCard(index + 1, "", "")
        )
    );

    const[vocabSetTitle, setVocabSetTitle] = useState("");
    const[vocabSetDescription, setVocabSetDescription] = useState("");
    const[termLanguage, setTermLanguage] = useState<LanguagePair>({
        "languageCode": "default",
        "languageName": "default"
    });
    const[definitionLanguage, setDefinitionLanguage] = useState<LanguagePair>({
        "languageCode": "default",
        "languageName": "default"
    });
    const[vocabularySet, setVocabularySet] = useState<VocabularySet>(
        new VocabularySet( {id: crypto.randomUUID(), title:vocabSetTitle , description: vocabSetDescription, termLanguage:termLanguage, definitionLanguage :definitionLanguage, cards: cards })
    );
    const [selectedTermLanguage, setSelectedTermLanguage] = useState("default");
    const [selectedDefinitionLanguage, setSelectedDefinitionLanguage] = useState("default");

    
    {/* Form Validation States */}
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [cardErrors, setCardErrors] = useState<Record<number, string>>({});
    const [termLanguageError, setTermLanguageError] = useState("");
    const [definitionLanguageError, setDefinitionLanguageError] = useState("");


    const addCard = () => { 
        const newId = cards.length + 1;

        setCards([
            ...cards, {
                id: cards.length + 1,
                term: "",
                definition: ""
            }
        ])
        
        setTimeout(() => {
            window.scrollBy({
                top: 150,
                behavior: 'smooth'
            });
        }, 0);

        return newId;
    };

    const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

    const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>, languageType: LanguageType) => {
        const selectedLanguageCode = event.target.value;

        if(languageType === LanguageType.Term) {
            setSelectedTermLanguage(selectedLanguageCode);
            setTermLanguageError("")
        }
        else {
            setSelectedDefinitionLanguage(selectedLanguageCode);
            setDefinitionLanguageError("")
        }
    }

    const submitVocabSet = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setTitleError(vocabSetTitle.trim() === "" ? "Title is required!" : "");
        setDescriptionError(vocabSetDescription.trim() === "" ? "Description is required" : "");
        if(Object.keys(LearningLanguages).includes(selectedTermLanguage)) {
            setTermLanguageError("");
        }
        else {
            setTermLanguageError("Please select a term language")
        }
         if(Object.keys(LearningLanguages).includes(selectedDefinitionLanguage)) {
            setDefinitionLanguageError("");
        }
        else {
            setDefinitionLanguageError("Please select a definition language")
        }
       // setDefinitionLanguageError(selectedDefinitionLanguage === "default" ? "Please select a definition language" : "");

        const cardErrors: Record<number, string> = {};
        const EmptyCards: Array<number> = [];

        cards.forEach(card => {
            const hasTerm = card.term.trim() !== "";
            const hasDefinition = card.definition.trim() !== "";

            if (!hasTerm && !hasDefinition) {
                EmptyCards.push(card.id);
            }
            
            else if(hasTerm &&!hasDefinition) {
                cardErrors[card.id] = "Definition required";
            }
            
            else if(!hasTerm && hasDefinition) {
                cardErrors[card.id] = "Term required";
            }
        });
        
        setCardErrors(cardErrors);

        if (Object.keys(cardErrors).length > 0) {
            return;
        }

        const validCards = cards 
            .filter(card => !EmptyCards.includes(card.id))
            .map((card, index) => ({
                ...card,
                id: index + 1 
            }))

        setCards(validCards);

        console.log("Submitting Vocabulary Set");
        console.log("Vocabulary Set Title: ", vocabSetTitle);
        console.log("Vocabulary Set Description: ", vocabSetDescription);
        console.log("Term Language: ", selectedTermLanguage);
        console.log("Definition Language: ", selectedDefinitionLanguage);
        console.log(validCards);
    };

    return (
        <>
        {user ? (
            <div className="container-fluid">
                {/* Vocabulary Set Title*/}
                <form onSubmit={(event) => {
                    event.preventDefault();
                    submitVocabSet(event);
                    }}>

                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <div className="col-md-4 mb-3">
                                <label id = "vocabset-name-label" htmlFor="vocabset-name" className="form-label vocab-set-form-labels">Title</label>
                                <input
                                    type="text" 
                                    className={`form-control ${titleError ? "is-invalid" : ""}`}
                                    id="vocabset-name" 
                                    placeholder="Enter a Name for the Vocabulary Set" 
                                    value={vocabSetTitle} 
                                    onChange={(event) => {
                                        setVocabSetTitle(event.target.value)
                                        setTitleError(event.target.value.trim() === "" ? "Title is required!" : "");
                                        }
                                    }
                                    onKeyDown={(event) => {
                                        if(event.key == "Enter") {
                                            event.preventDefault()
                                            inputRefs.current["vocabset-description"]?.focus()
                                        }
                                    }
                                        
                                    } 
                                 />
                                 {
                                    titleError && (
                                        <div className="invalid-feedback">
                                            {titleError}
                                        </div>
                                    )
                                 }
                            </div>
                        </div>
                    </div>  

                    {/* Vocabulary Set Description */}
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <div className="col-md-4 mb-3">
                                <label id = "vocabset-description-label" htmlFor="vocabset-description" className="form-label vocab-set-form-labels">Description</label>
                                <textarea
                                    className={`form-control ${descriptionError ? "is-invalid" : ""}`} 
                                    id="vocabset-description" 
                                    rows={3} placeholder="Enter a description for the Vocabulary Set"
                                    value={vocabSetDescription}
                                    ref={(element) => {
                                        inputRefs.current["vocabset-description"] = element;
                                    }}

                                    onChange={(event) => {
                                        setVocabSetDescription(event.target.value)
                                        setDescriptionError(event.target.value.trim() === "" ? "Description is required!" : "");

                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key == "Enter" && event.shiftKey) {
                                            return;
                                        }
                                        if (event.key == "Enter" ) {
                                            event.preventDefault();
                                            inputRefs.current[`term-${1}`]?.focus();
                                        }
                                    }}>
                                </textarea>

                                {
                                    descriptionError && (
                                        <div className="invalid-feedback">
                                            {descriptionError}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    {/* Vocabulary Cards*/}

                    {/* Vocabulary Set Term */}
                    {cards.map(card =>(
                        <div className="row justify-content-center" key={card.id}>
                            <div className="col-md-2 mb-3">
                                <input 
                                    type="text" 
                                    className={`form-control ${
                                        cardErrors[card.id] === "Term required" ? "is-invalid" : ""
                                    }`}
                                    id={`term-${card.id}`} 
                                    placeholder="Term"
                                    value={card.term}
                                    onChange={(event) => {
                                        const updatedCards = cards.map(newCard => {
                                            if (newCard.id === card.id) { 
                                                return { ...newCard, term: event.target.value };
                                            }
                                            return newCard;
                                        });
                                        setCards(updatedCards);
                                        }
                                    }
                                    
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" ) {
                                            event.preventDefault();

                                            if(card.id === cards.length) {
                                                const newCardId = addCard();

                                                setTimeout(() => {
                                                    inputRefs.current[`term-${newCardId}`]?.focus();
                                                }, 0);
                                            }
                                            else {
                                                    inputRefs.current[`term-${card.id+1}`]?.focus();
                                            }
                                        }
                                    }} 

                                    ref={(element) => {
                                        inputRefs.current[`term-${card.id}`] = element;
                                    }}
                                />
                                {/* Term Language Selection */}
                                <select className={`form-select language-select ${termLanguageError ? "is-invalid" : ""}`} id={`term-${card.id}-language-select`} onChange={(event) => onLanguageChange(event, LanguageType.Term)} value ={selectedTermLanguage}>
                                    <option className="vocab-set-form-labels" value="default" disabled>Choose a Language</option>

                                    {learningLanguages.map((language) => (
                                        <option className="vocab-set-form-labels" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedDefinitionLanguage}>
                                            {language.languageName}
                                        </option>
                                    ))}
                                </select>
                                {
                                    termLanguageError && (
                                    <div className="invalid-feedback">
                                        {termLanguageError}
                                    </div>)
                                }
                            </div>

                            {/* Vocabulary Set Definition */}
                            <div className="col-md-2 mb-3">
                                <input
                                    type="text" 
                                    className={`form-control ${
                                        cardErrors[card.id] === "Definition required" ? "is-invalid" : ""
                                    }`}
                                    id={`definition-${card.id}`} 
                                    placeholder="Definition"
                                    value={card.definition}
                                    onChange={(event) => {
                                        const updatedCards = cards.map(newCard => {
                                            if (newCard.id === card.id) {
                                                return { ...newCard, definition: event.target.value };
                                            }
                                            return newCard;
                                        });
                                        setCards(updatedCards);
                                        }
                                    } 
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" ) {
                                            event.preventDefault();

                                            if(card.id === cards.length) {
                                                const newCardId = addCard();

                                                setTimeout(() => {
                                                    inputRefs.current[`term-${newCardId}`]?.focus();
                                                }, 0);
                                            }
                                            else {
                                                    inputRefs.current[`term-${card.id+1}`]?.focus();
                                            }
                                        }
                                    }}
                                    ref={(element) => {
                                        inputRefs.current[`definition-${card.id}`] = element;
                                    }} 
                                />

                                {/* Definition Language Selection */}
                                <select className={`form-select language-select ${definitionLanguageError ? "is-invalid" : ""}`} id={`definition-${card.id}-language-select`} onChange={(event) => onLanguageChange(event, LanguageType.Definition)} value={selectedDefinitionLanguage}>
                                    <option className="vocab-set-form-labels" value="default" disabled selected>Choose a Language</option>
                                    {learningLanguages.map((language) => (
                                        <option className="vocab-set-form-labels" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedTermLanguage}>
                                            {language.languageName}
                                        </option>
                                ))}
                                </select>
                                 {
                                    definitionLanguageError && (
                                    <div className="invalid-feedback">
                                        {definitionLanguageError}
                                    </div>)
                                }
                            </div>
                        </div>
                    ))}

                    {/* Add Card Button */}
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <button type="button" className="btn btn-primary vocab-set-form-labels" onClick={() =>addCard()}>Add Card</button>
                        </div>
                    </div>
                    <div style={{ height: "50px" }}></div>

                    {/* Vocab Set Creation Button */}
                    <div className="row">
                        <div className="col d-flex justify-content-center">
                            <button className="btn btn-primary vocab-set-form-labels"type="submit" id="submit-vocabset-button">Create Vocabulary Set</button>
                        </div>
                    </div>
                    <div style={{ height: "100px" }}></div>
                </form>
            </div>
                    
        ) : (<LoginPrompt/>)}
        </>
    );
}
