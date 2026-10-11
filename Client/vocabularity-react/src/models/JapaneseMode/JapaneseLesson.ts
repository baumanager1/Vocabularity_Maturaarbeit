
export default class JapaneseLesson {
    lessonNumber: number;
    kanjis : Array<Kanji>;
    vocabulary : Array<JapaneseVocabulary>

    constructor (
        lessonNumber: number,
         kanjis: Array<Kanji>,
         japaneseVocabulary : Array<JapaneseVocabulary>
        ) {
        this.lessonNumber = lessonNumber;
        this.kanjis = kanjis
        this.vocabulary = japaneseVocabulary
    }
}

export interface JapaneseLessonSummary {
    lessonNumber : number,
    lessonId : string
}

class Kanji {
    kanjiId : number;
    character : string;
    meanings : Array<Meaning>;
    readings : Array<KanjiReading>;

    constructor (
        kanjiId : number,
        character : string,
        meanings : Array<Meaning>,
        readings : Array<KanjiReading>
    ) {
        this.kanjiId = kanjiId,
        this.character = character,
        this.meanings = meanings,
        this.readings = readings
    }

}

class Meaning {
    meaning : string;
    meaningId : number;
    acceptedAnswer : boolean;


    constructor (
        meaning : string,
        meaningId : number,
        acceptedAnswer : boolean
    ) {
        this.meaning = meaning,
        this.meaningId = meaningId
        this.acceptedAnswer = acceptedAnswer
    }
}

class KanjiReading {
    reading : string;
    readingId : number;
    readingType : string;
    acceptedAnswer : boolean;

    constructor (
        reading : string,
        readingId : number,
        readingType : string,
        acceptedAnswer : boolean
    ) {
        this.reading = reading,
        this.readingId = readingId
        this.readingType = readingType,
        this.acceptedAnswer = acceptedAnswer
    }
}


class JapaneseVocabulary {
    vocabularyId : number;
    word : string;
    meanings: Array<Meaning>;
    readings : Array<VocabularyReading>

    constructor (
        vocabularyId : number,
        word : string,
        meanings : Array<Meaning>,
        readings: Array<VocabularyReading>
    ) {
        this.vocabularyId = vocabularyId,
        this.word = word,
        this.meanings = meanings,
        this.readings = readings
    }
}

class VocabularyReading {
    reading : string;
    readingId : number;
    acceptedAnswer : boolean;

    constructor(
        reading : string,
        readingId : number,
        acceptedAnswer : boolean
    ) {
        this.reading = reading,
        this.readingId = readingId
        this.acceptedAnswer = acceptedAnswer
    }
}

export interface JapaneseLearnMode {
    japaneseVocabulary : JapaneseVocabulary
    kanji: Kanji
    meaning : Meaning
    kanjiReading : KanjiReading
    vocabularyReading: VocabularyReading
    japaneseItemType: JapaneseItemType
}

interface JapaneseItemType {
    kanji : Kanji,
    japaneseVocabulary : JapaneseVocabulary
}