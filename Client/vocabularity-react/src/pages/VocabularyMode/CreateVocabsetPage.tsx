import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import { useState, useRef } from 'react';
import { learningLanguages, LanguageType, LanguagePair } from "../../models/LearningMode/Languagepair";
import getLanguageName from "../../models/LearningMode/Languagepair";
import "./styles/CreateVocabsetPage.scss";
import  VocabularyCard from "../../models/LearningMode/VocabularyCard";


export default function CreateVocabsetPage({}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const[cards,  setCards] = useState<VocabularyCard[]>
    (Array .from({ length: 3 }, (_, index) => ({
        id: index + 1,
        term: "",
        definition: ""
    })));


    
    const [selectedTermLanguage, setSelectedTermLanguage] = useState("");
    const [selectedDefinitionLanguage, setSelectedDefinitionLanguage] = useState("");

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

    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>, languageType: LanguageType) => {
        const selectedLanguageCode = event.target.value;

        if(languageType === LanguageType.Term) {
            setSelectedTermLanguage(selectedLanguageCode);
        }
        else {
            setSelectedDefinitionLanguage(selectedLanguageCode);
        }
    }

    const submitVocabSet = () => {
    };

    return (
        <>
        {user ? (
            <div className="container-fluid">
                {/* Vocabulary Set Title*/}
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <div className="col-md-4 mb-3">
                            <label id = "vocabset-name-label" htmlFor="vocabset-name" className="form-label vocab-set-form-labels">Title</label>
                            <input type="text" className="form-control" id="vocabset-name" placeholder="Enter a Name for the Vocabulary Set" />
                        </div>
                    </div>
                </div>
                {/* Vocabulary Set Description */}
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="col-md-4 mb-3">
                            <label id = "vocabset-description-label" htmlFor="vocabset-description" className="form-label vocab-set-form-labels">Description</label>
                            <textarea className="form-control" id="vocabset-description" rows={3} placeholder="Enter a description for the Vocabulary Set"></textarea>
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
                                className="form-control" 
                                id={`term-${card.id}`} 
                                placeholder="Term" 
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
                            <select className="form-select language-select" id={`term-${card.id}-language-select`} onChange={(event) => onLanguageChange(event, LanguageType.Term)}>
                                <option className="vocab-set-form-labels" value="default" disabled selected>Choose a Language</option>

                                {learningLanguages.map((language) => (
                                    <option className="vocab-set-form-labels" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedDefinitionLanguage}>
                                        {language.languageName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vocabulary Set Definition */}
                        <div className="col-md-2 mb-3">
                            <input
                                type="text" 
                                className="form-control" 
                                id={`definition-${card.id}`} 
                                placeholder="Definition" 
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
                                }} />
                                <select className="form-select language-select" id={`definition-${card.id}-language-select`} onChange={(event) => onLanguageChange(event, LanguageType.Definition)}>
                                    <option className="vocab-set-form-labels" value="default" disabled selected>Choose a Language</option>
                                    {learningLanguages.map((language) => (
                                        <option className="vocab-set-form-labels" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedTermLanguage}>
                                            {language.languageName}
                                        </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <button className="btn btn-primary vocab-set-form-labels" onClick={() =>addCard()}>Add Card</button>
                    </div>
                </div>
                <div style={{ height: "50px" }}></div>
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <button className="btn btn-primary vocab-set-form-labels" id="submit-vocabset-button" onClick={() => submitVocabSet()}>Create Vocabulary Set</button>
                    </div>
                </div>
            <div style={{ height: "100px" }}></div>
        </div>
                    
        ) : (<LoginPrompt/>)}
        </>
    );
}
