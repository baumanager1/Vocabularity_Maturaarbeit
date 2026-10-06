export default function normalizeAnswer(answer: string): string {
    return answer
    .trim()
    .toLowerCase()
    .replaceAll("ß", "ss");
}