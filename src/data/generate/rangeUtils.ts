export function numberToRanges(numbers: number[]): (number | [number, number])[] {
    if (numbers.length === 0) return [];
        
    const sorted = [...numbers].sort((a, b) => a - b);
    const result: (number | [number, number])[] = [];
    let rangeStart = sorted[0];
    let rangeEnd = sorted[0];
    
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === rangeEnd + 1) {
            rangeEnd = sorted[i];
        } else {
            if (rangeEnd === rangeStart) {
                result.push(rangeStart);
            } else if (rangeEnd === rangeStart + 1) {
                result.push(rangeStart);
                result.push(rangeEnd);
            } else {
                result.push([rangeStart, rangeEnd + 1]);
            }
            rangeStart = sorted[i];
            rangeEnd = sorted[i];
        }
    }
    
    // Handle the last range
    if (rangeEnd === rangeStart) {
        result.push(rangeStart);
    } else if (rangeEnd === rangeStart + 1) {
        result.push(rangeStart);
        result.push(rangeEnd);
    } else {
        result.push([rangeStart, rangeEnd + 1]);
    }
    
    return result;
}
