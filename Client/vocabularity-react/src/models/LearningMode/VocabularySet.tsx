import { LanguagePair, LearningLanguages } from "./Languagepair";
import VocabularyCard from "./VocabularyCard";

export default class VocabularySet {
    id: string;
    title: string;
    description: string;
    termLanguage: LanguagePair;
    definitionLanguage: LanguagePair;
    cards: VocabularyCard[];

    constructor(parameters: {
        id: string,
        title: string,
        description: string, 
        termLanguage: LanguagePair, 
        definitionLanguage: LanguagePair, 
        cards: VocabularyCard[];
    }) {
        this.id = parameters.id;
        this.title = parameters.title;
        this.description = parameters.description;
        this.termLanguage = parameters.termLanguage;
        this.definitionLanguage = parameters.definitionLanguage;
        this.cards = parameters.cards;
    }

}
