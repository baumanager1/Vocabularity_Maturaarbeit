    export interface LanguagePair {
        languageCode: string;
        languageName: string;
    }

    export const learningLanguages : LanguagePair[] = [
        { languageCode: "en", languageName: "English" },
        { languageCode: "de", languageName: "German" },
        { languageCode: "fr", languageName: "French" },
        { languageCode: "es", languageName: "Spanish" },
        { languageCode: "it", languageName: "Italian" },
        { languageCode: "jp", languageName: "Japanese" },
    ];

    export default function getLanguageName(languageCode:string) {
        return learningLanguages.find((language) => language.languageCode === languageCode)!.languageName;
    }

export enum LanguageType {
    Term,
    Definition
}