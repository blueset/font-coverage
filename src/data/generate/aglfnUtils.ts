
const UNI_SEQUENCE = /^uni(?:(?:[0-9a-fA-F]{4}){2,}|[0-9a-fA-F]{4,6})$/;
const U_SINGLE = /^u([0-9a-fA-F]{4,6})$/;

export const parseUniSequence = (name: string): number[] | null => {
    if (!UNI_SEQUENCE.test(name)) {
        return null;
    }
    const hex = name.slice(3);
    if (!hex) {
        return null;
    }
    if (hex.length <= 6) {
        const value = Number.parseInt(hex, 16);
        if (Number.isNaN(value)) {
            return null;
        }
        return [value];
    }
    if (hex.length % 4 !== 0) {
        return null;
    }
    const codepoints: number[] = [];
    for (let i = 0; i < hex.length; i += 4) {
        const slice = hex.slice(i, i + 4);
        const value = Number.parseInt(slice, 16);
        if (Number.isNaN(value)) {
            return null;
        }
        codepoints.push(value);
    }
    return codepoints;
};

export const parseUSingle = (name: string): number[] | null => {
    const match = name.match(U_SINGLE);
    if (!match) {
        return null;
    }
    const value = Number.parseInt(match[1], 16);
    if (Number.isNaN(value)) {
        return null;
    }
    return [value];
};
