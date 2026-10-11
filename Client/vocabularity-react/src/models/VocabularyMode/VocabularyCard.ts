
export default class VocabularyCard {
    id: number;
    term: string;
    definition: string;

    constructor(id: number, term: string, definition: string) {
        this.id = id;
        this.term = term;
        this.definition = definition;
    }
}