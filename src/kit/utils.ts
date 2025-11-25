import type { Lookup } from "fontkit";

export const materialize = <T = unknown>(value: unknown): T[] => {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        return value as T[];
    }
    const possible = value as { length?: number; get?: (index: number) => T };
    if (typeof possible.length === "number" && typeof possible.get === "function") {
        const items: T[] = [];
        for (let i = 0; i < possible.length; i++) {
            const item = possible.get(i);
            if (item !== undefined && item !== null) {
                items.push(item);
            }
        }
        return items;
    }
    return [];
};

export const getSubTables = (lookup: Lookup | undefined): unknown[] => {
    if (!lookup) {
        return [];
    }
    const tables = (lookup as { subTables?: unknown; subtables?: unknown }).subTables
        ?? (lookup as { subTables?: unknown; subtables?: unknown }).subtables;
    return materialize(tables);
};

export const coverageToGlyphs = (
    coverage: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] } | undefined,
): number[] => {
    if (!coverage) {
        return [];
    }
    if (Array.isArray(coverage.glyphs)) {
        return [...coverage.glyphs];
    }
    if (Array.isArray(coverage.rangeRecords)) {
        const glyphs: number[] = [];
        for (const range of coverage.rangeRecords) {
            for (let gid = range.start; gid <= range.end; gid++) {
                glyphs.push(gid);
            }
        } 
        return glyphs;
    }
    return [];
};
