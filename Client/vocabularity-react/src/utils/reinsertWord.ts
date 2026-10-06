function reinsertWord<T>(words: T[], word: T, minAmount: number, maxAmount: number): T[] {
    const result = [...words];

    if (result.length === 0) {
        return [word];
    }

    const minDistance = Math.min(minAmount, result.length);
    const maxDistance = Math.min(maxAmount, result.length);

    const position = Math.floor(Math.random() * (maxDistance - minDistance + 1)) + minDistance;

    result.splice(position, 0, word);

    return result;
}

export default reinsertWord;