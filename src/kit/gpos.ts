import type { LazyArray, Lookup } from "fontkit";
import type { MarkAdjacency } from "./type";
import { coverageToGlyphs, getSubTables } from "./utils";
import { codepointKey, collectChainingLookupIndices, materialize } from "./gsub";

export interface GPOSContext {
    markAdjacencies: MarkAdjacency[];
    glyphToCodepoints: Map<number, number[]>;
    lookupList: Lookup;
    seenLookups: Set<string>;
}

const isValidClassCount = (value: number | undefined): value is number =>
    typeof value === "number" && Number.isInteger(value) && value > 0;

const isValidClassIndex = (value: number | undefined, size: number): value is number =>
    typeof value === "number" && value >= 0 && value < size;

const createClassMappings = (classCount: number | undefined): MarkAdjacency[] =>
    isValidClassCount(classCount)
        ? Array.from({ length: classCount }, () => ({ from: new Set<string>(), to: new Set<string>() }))
        : [];

const getCodepointKeyForGlyph = (
    glyphId: number | undefined,
    glyphToCodepoints: Map<number, number[]>,
): string | null => {
    if (typeof glyphId !== "number") {
        return null;
    }
    const codepoints = glyphToCodepoints.get(glyphId);
    if (!codepoints?.length) {
        return null;
    }
    return codepointKey(codepoints);
};

const flushMappings = (mappings: MarkAdjacency[], target: MarkAdjacency[]) => {
    for (const mapping of mappings) {
        if (mapping.from.size > 0 && mapping.to.size > 0) {
            target.push(mapping);
        }
    }
};

const consumeFeatureContext = (...args: unknown[]) => args.length;

export const processLookupByIndex = (
    lookupIndex: number,
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    const { seenLookups, lookupList } = context;
    if (!Number.isInteger(lookupIndex) || lookupIndex < 0) {
        return;
    }
    const key = `${lookupIndex}:${tag}`;
    if (seenLookups.has(key)) {
        return;
    }
    seenLookups.add(key);
    const lookup = lookupList.get(lookupIndex) as Lookup | undefined;
    if (lookup) {
        processLookupObject(lookup, tag, isDefaultOn, context);
    }
};

export const processLookupObject = (
    lookup: Lookup,
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    if (!lookup || typeof lookup.lookupType !== "number") {
        return;
    }
    const subTables = getSubTables(lookup);
    switch (lookup.lookupType) {
        case 4:
            handleMarkToBaseAttachment(subTables, tag, isDefaultOn, context);
            break;
        case 5:
            handleMarkToLigatureAttachment(subTables, tag, isDefaultOn, context);
            break;
        case 6:
            handleMarkToMarkAttachment(subTables, tag, isDefaultOn, context);
            break;
        case 8:
            handleChainedContextualPositioning(subTables, tag, isDefaultOn, context);
            break;
        case 9:
            handleExtensionPositioning(subTables, tag, isDefaultOn, context);
            break;
        default:
            break;
    }
};

export const handleMarkToBaseAttachment = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    consumeFeatureContext(tag, isDefaultOn);
    const { markAdjacencies, glyphToCodepoints } = context;
    for (const subTable of subTables) {
        if (!subTable || typeof subTable !== "object") {
            continue;
        }
        const table = subTable as {
            version: number;
            format: number;
            classCount?: number;
            baseCoverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            markCoverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            baseArray?: LazyArray<unknown> | unknown[];
            markArray?: LazyArray<{ class?: number }> | { class?: number }[];
        };
        const mappingByClass = createClassMappings(table.classCount);
        if (!mappingByClass.length) {
            continue;
        }
        const baseGlyphs = coverageToGlyphs(table.baseCoverage);
        const markGlyphs = coverageToGlyphs(table.markCoverage);
        if (!baseGlyphs.length || !markGlyphs.length) {
            continue;
        }

        const markRecords = materialize<{ class?: number }>(table.markArray);
        for (let index = 0; index < markRecords.length && index < markGlyphs.length; index++) {
            const markClass = markRecords[index]?.class;
            if (!isValidClassIndex(markClass, mappingByClass.length)) {
                continue;
            }
            const markKey = getCodepointKeyForGlyph(markGlyphs[index], glyphToCodepoints);
            if (markKey === null) {
                continue;
            }
            mappingByClass[markClass].to.add(markKey);
        }

        const baseRecordsList = materialize<unknown>(table.baseArray);
        for (let baseIndex = 0; baseIndex < baseRecordsList.length && baseIndex < baseGlyphs.length; baseIndex++) {
            const baseKey = getCodepointKeyForGlyph(baseGlyphs[baseIndex], glyphToCodepoints);
            if (baseKey === null) {
                continue;
            }
            const anchorsByClass = materialize<unknown>(baseRecordsList[baseIndex]);
            for (let classIndex = 0; classIndex < anchorsByClass.length && classIndex < mappingByClass.length; classIndex++) {
                if (anchorsByClass[classIndex]) {
                    mappingByClass[classIndex].from.add(baseKey);
                }
            }
        }

        flushMappings(mappingByClass, markAdjacencies);
    }
};

export const handleMarkToLigatureAttachment = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    consumeFeatureContext(tag, isDefaultOn);
    const { markAdjacencies, glyphToCodepoints } = context;
    for (const subTable of subTables) {
        if (!subTable || typeof subTable !== "object") {
            continue;
        }
        const table = subTable as {
            classCount?: number;
            markCoverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            ligatureCoverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            markArray?: LazyArray<{ class?: number }> | { class?: number }[];
            ligatureArray?: LazyArray<unknown> | unknown[];
        };

        const mappingByClass = createClassMappings(table.classCount);
        if (!mappingByClass.length) {
            continue;
        }
        const markGlyphs = coverageToGlyphs(table.markCoverage);
        const ligatureGlyphs = coverageToGlyphs(table.ligatureCoverage);
        if (!markGlyphs.length || !ligatureGlyphs.length) {
            continue;
        }

        const markRecords = materialize<{ class?: number }>(table.markArray);
        for (let index = 0; index < markRecords.length && index < markGlyphs.length; index++) {
            const markClass = markRecords[index]?.class;
            if (!isValidClassIndex(markClass, mappingByClass.length)) {
                continue;
            }
            const markKey = getCodepointKeyForGlyph(markGlyphs[index], glyphToCodepoints);
            if (markKey === null) {
                continue;
            }
            mappingByClass[markClass].to.add(markKey);
        }

        const ligatureRecords = materialize<unknown>(table.ligatureArray);
        for (let ligIndex = 0; ligIndex < ligatureRecords.length && ligIndex < ligatureGlyphs.length; ligIndex++) {
            const baseKey = getCodepointKeyForGlyph(ligatureGlyphs[ligIndex], glyphToCodepoints);
            if (baseKey === null) {
                continue;
            }
            const componentRecords = materialize<unknown>(ligatureRecords[ligIndex]);
            for (const component of componentRecords) {
                const anchorsByClass = materialize<unknown>(component);
                for (let classIndex = 0; classIndex < anchorsByClass.length && classIndex < mappingByClass.length; classIndex++) {
                    if (anchorsByClass[classIndex]) {
                        mappingByClass[classIndex].from.add(baseKey);
                    }
                }
            }
        }

        flushMappings(mappingByClass, markAdjacencies);
    }
};

export const handleMarkToMarkAttachment = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    consumeFeatureContext(tag, isDefaultOn);
    const { markAdjacencies, glyphToCodepoints } = context;
    for (const subTable of subTables) {
        if (!subTable || typeof subTable !== "object") {
            continue;
        }
        const table = subTable as {
            classCount?: number;
            mark1Coverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            mark2Coverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            mark1Array?: LazyArray<{ class?: number }> | { class?: number }[];
            mark2Array?: LazyArray<unknown> | unknown[];
        };

        const mappingByClass = createClassMappings(table.classCount);
        if (!mappingByClass.length) {
            continue;
        }
        const mark1Glyphs = coverageToGlyphs(table.mark1Coverage);
        const mark2Glyphs = coverageToGlyphs(table.mark2Coverage);
        if (!mark1Glyphs.length || !mark2Glyphs.length) {
            continue;
        }

        const mark1Records = materialize<{ class?: number }>(table.mark1Array);
        for (let index = 0; index < mark1Records.length && index < mark1Glyphs.length; index++) {
            const markClass = mark1Records[index]?.class;
            if (!isValidClassIndex(markClass, mappingByClass.length)) {
                continue;
            }
            const markKey = getCodepointKeyForGlyph(mark1Glyphs[index], glyphToCodepoints);
            if (markKey === null) {
                continue;
            }
            mappingByClass[markClass].to.add(markKey);
        }

        const mark2Records = materialize<unknown>(table.mark2Array);
        for (let baseIndex = 0; baseIndex < mark2Records.length && baseIndex < mark2Glyphs.length; baseIndex++) {
            const baseKey = getCodepointKeyForGlyph(mark2Glyphs[baseIndex], glyphToCodepoints);
            if (baseKey === null) {
                continue;
            }
            const anchorsByClass = materialize<unknown>(mark2Records[baseIndex]);
            for (let classIndex = 0; classIndex < anchorsByClass.length && classIndex < mappingByClass.length; classIndex++) {
                if (anchorsByClass[classIndex]) {
                    mappingByClass[classIndex].from.add(baseKey);
                }
            }
        }

        flushMappings(mappingByClass, markAdjacencies);
    }
};

export const handleChainedContextualPositioning = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    const nestedLookups = new Set<number>();
    for (const subtable of subTables) {
        collectChainingLookupIndices(subtable, nestedLookups);
    }
    nestedLookups.forEach((index) => processLookupByIndex(index, tag, isDefaultOn, context));
};

export const handleExtensionPositioning = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GPOSContext,
) => {
    for (const subtable of subTables) {
        if (!subtable || typeof subtable !== "object") {
            continue;
        }
        const extensionLookup = (subtable as { extension?: Lookup }).extension;
        if (extensionLookup) {
            processLookupObject(extensionLookup, tag, isDefaultOn, context);
        }
    }
};
