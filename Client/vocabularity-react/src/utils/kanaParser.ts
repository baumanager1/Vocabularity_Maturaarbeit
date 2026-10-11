import hiragana from '../models/JapaneseMode/KanaMappings/hiragana.json'
import katakana from '../models/JapaneseMode/KanaMappings/katakana.json'


export  class kanaParser {

    private static currentKanaMap : Record<string, string>= hiragana    

            /**
         * Converts a romaji or mixed romaji & kana string into the specified Kana type.
         *
         * @param mixedString The input string, which may contain romaji or a mix of romaji and kana.
         * @param kanaType The type of kana the text should be converted to
         * @return The Converted kana string.
         */
    static parseRomajiToKana(mixedString : string, kanaType: KanaType) {
        this.currentKanaMap = kanaType === KanaType.HIRAGANA
        ? hiragana
        : katakana

        const input = mixedString
        var i : number = 0;
        let result = "";

        while (i < input.length) {
            var matched = false;
            // Try 3, 2, 1 length matches
            for (let len :number = 3; len >= 1; len--) {
                if((i + len) <= input.length) {
                    let sub : string = input.substring(i, i +len);
                    
                    const kanaValues = new Set(Object.values(this.currentKanaMap))


                    // Check if sub is already kana (keep as is)
                    if(kanaValues.has(sub)) {
                        result += sub;
                        i += len;
                        matched = true;
                        break;
                    }

                    // Check if sub is a romaji syllable
                    let kana: string = this.currentKanaMap[sub]
                    if (kana != null) {
                        result += kana;
                        i += len;
                        matched = true;
                        break;
                    }
                }
            }

            // If no match found, just append current char and move on (avoid infinite loop)
            if(!matched) {
                result +=(input[i]);
                i++;
            }
        }
        return result;
    }



}

export enum KanaType {
    HIRAGANA,
    KATAKANA
}
