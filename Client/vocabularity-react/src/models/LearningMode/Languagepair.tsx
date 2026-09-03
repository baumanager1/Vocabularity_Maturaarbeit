export interface LanguagePair {
    languageCode: string;
    languageName: string;
}

export enum LearningLanguages {
    en = "English",
    de = "German",
    fr = "French",
    es = "Spanish",
    it = "Italian",
    jp = "Japanese"
}


export enum LanguageType {
    Term,
    Definition
}


export const learningLanguages : LanguagePair[] = Object.entries(LearningLanguages).map(([languageCode, languageName]) => ({
    languageCode,
    languageName
}));

export default function getLanguageName(languageCode:string) {
    return learningLanguages.find((language) => language.languageCode === languageCode)!.languageName;
}
