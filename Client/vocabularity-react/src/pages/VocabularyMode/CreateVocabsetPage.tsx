import { useNavigate } from "react-router-dom";
import {useAuth} from "../../components/Authentication/AuthContext";
import LoginPrompt from "../../components/Authentication/LoginPrompt";
import {LanguagePair} from "../../models/Languagepair";
import { useState } from 'react';
import getLanguageName from "../../models/Languagepair";
import { learningLanguages } from "../../models/Languagepair";
import "./styles/CreateVocabsetPage.scss";
import { LanguageType } from "../../models/Languagepair";


export default function CreateVocabsetPage({}) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedTermLanguage, setSelectedTermLanguage] = useState("");
    const [selectedDefinitionLanguage, setSelectedDefinitionLanguage] = useState("");

    const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>, languageType: LanguageType) => {
        const selectedLanguageCode = event.target.value;

        if(languageType === LanguageType.Term) {
            setSelectedTermLanguage(selectedLanguageCode);
        }
        else {
            setSelectedDefinitionLanguage(selectedLanguageCode);
        }
    }

    return (
        <>
        {user ? (
            <div className="container-fluid">
                <div className="row">
                    <div className="col d-flex justify-content-center">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="vocabset-name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="vocabset-name" placeholder="Enter a Name for the Vocabulary Set" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="vocabset-description" className="form-label">Description</label>
                            <textarea className="form-control" id="vocabset-description" rows={3} placeholder="Enter a description for the Vocabulary Set"></textarea>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-2 mb-4">
                        <input type="text" className="form-control" id="term-1" placeholder="Term" />
                        <select className="form-select language-select" id="term-1-language-select" onChange={(event) => onLanguageChange(event, LanguageType.Term)}>
                            {learningLanguages.map((language) => (
                                <option className="language-select-option" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedDefinitionLanguage}>
                                   {language.languageName}
                                </option>
                            ))}
                                <option className="language-select-option" value="default" disabled selected>Select a Language</option>
                        </select>
                    </div>
                    <div className="col-md-2 mb-3">
                        <input type="text" className="form-control" id="definition-1" placeholder="Definition" />
                        <select className="form-select language-select" id="definition-1-language-select" onChange={(event) => onLanguageChange(event, LanguageType.Definition)}>
                            {learningLanguages.map((language) => (
                                <option className="language-select-option" key={language.languageCode} value={language.languageCode} disabled={language.languageCode === selectedTermLanguage}>
                                   {language.languageName}
                                </option>
                            ))}
                                <option className="language-select-option" value="default" disabled selected>Select a Language</option>
                        </select>
                    </div> 
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-2 mb-3">
                        <input type="text" className="form-control" id="term-2" placeholder="Term" />
                        <label htmlFor="term-2" className="form-label text-muted">English</label>
                    </div>
                    <div className="col-md-2 mb-3">
                        <input type="text" className="form-control" id="definition-2" placeholder="Definition" />
                        <label htmlFor="definition-2" className="form-label text-muted">German</label>
                    </div> 
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-2 mb-3">
                        <input type="text" className="form-control" id="term-3" placeholder="Term" />
                    </div>
                    <div className="col-md-2 mb-3">
                        <input type="text" className="form-control" id="definition-3" placeholder="Definition" />
                        <label htmlFor="definition-3" className="form-label text-muted">German</label>
                    </div> 
                </div>
            </div>
            
        ) : (<LoginPrompt/>)}
        </>
    );
}
