import { LanguagePair, LearningLanguages } from "./Languagepair";
import VocabularyCard from "./VocabularyCard";

export default class VocabularySet {
    vocabularySetId: string;
    title: string;
    description: string;
    termLanguage: LanguagePair;
    definitionLanguage: LanguagePair;
    cards: VocabularyCard[];

    constructor(parameters: {
        vocabularySetId: string,
        title: string,
        description: string, 
        termLanguage: LanguagePair, 
        definitionLanguage: LanguagePair, 
        cards: VocabularyCard[];
    }) {
        this.vocabularySetId = parameters.vocabularySetId;
        this.title = parameters.title;
        this.description = parameters.description;
        this.termLanguage = parameters.termLanguage;
        this.definitionLanguage = parameters.definitionLanguage;
        this.cards = parameters.cards;
    }

}
