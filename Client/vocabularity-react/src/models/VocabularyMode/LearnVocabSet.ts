export type Word = {
    id: number;
    term: string;
    definition: string;
};

export type LearnVocabSet = {
    termLanguage: string;
    definitionLanguage: string;
    words: Word[];
};