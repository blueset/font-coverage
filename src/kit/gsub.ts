import type { Lookup } from "fontkit";
import type { GlyphInfo, GlyphToCodepoints } from "./type";
import { coverageToGlyphs, getSubTables } from "./utils";

export interface GSUBContext {
    glyphs: GlyphInfo[];
    glyphsKeySet: Set<string>;
    glyphToCodepoints: GlyphToCodepoints;
    lookupList: Lookup;
    seenLookups: Set<string>;
}

export const codepointKey = (codepoints: number[]) => codepoints.join(",");

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

export const recordGlyphMapping = (glyphId: number, codepoints: number[], glyphToCodepoints: GlyphToCodepoints): number[] => {
    const clone = [...codepoints];
    glyphToCodepoints.set(glyphId, clone);
    return clone;
};

export const glyphSequenceToCodepoints = (glyphIds: number[], glyphToCodepoints: GlyphToCodepoints): number[] => {
    const sequence: number[] = [];
    for (const glyphId of glyphIds) {
        const mapping = glyphToCodepoints.get(glyphId);
        if (!mapping || !mapping.length) {
            return [];
        }
        sequence.push(...mapping);
    }
    return sequence;
};

export const emitVariant = (codepoints: number[], tag: string, isDefaultOn: boolean, context: GSUBContext) => {
    const { glyphs, glyphsKeySet } = context;
    if (!codepoints.length) {
        return;
    }
    const clone = [...codepoints];
    const variantKey = `${tag}:${codepointKey(clone)}`;
    if (!glyphsKeySet.has(variantKey)) {
        glyphs.push({ codepoints: clone, variants: [tag] });
        glyphsKeySet.add(variantKey);
    }
    if (isDefaultOn) {
        const baseKey = codepointKey(clone);
        if (!glyphsKeySet.has(baseKey)) {
            glyphs.push({ codepoints: clone });
            glyphsKeySet.add(baseKey);
        }
    }
};

export const addLookupRecords = (records: unknown, target: Set<number>) => {
    const lookupRecords = materialize<{ lookupListIndex?: number }>(records);
    for (const record of lookupRecords) {
        const index = record?.lookupListIndex;
        if (typeof index === "number") {
            target.add(index);
        }
    }
};

export const collectContextLookupIndices = (subtable: unknown, target: Set<number>) => {
    if (!subtable || typeof subtable !== "object") {
        return;
    }
    const table = subtable as Record<string, unknown>;
    const format = typeof table.version === "number"
        ? Number(table.version)
        : typeof table.substFormat === "number"
            ? Number(table.substFormat)
            : 1;

    if (format === 1) {
        const ruleSets = materialize<unknown>(table.ruleSets);
        for (const ruleSet of ruleSets) {
            const rules = materialize<{ lookupRecords?: unknown }>(ruleSet);
            for (const rule of rules) {
                addLookupRecords(rule.lookupRecords, target);
            }
        }
        return;
    }

    if (format === 2) {
        const classSet = materialize<unknown>(table.classSet);
        for (const classRules of classSet) {
            const rules = materialize<{ lookupRecords?: unknown }>(classRules);
            for (const rule of rules) {
                addLookupRecords(rule.lookupRecords, target);
            }
        }
        return;
    }

    if (format === 3) {
        addLookupRecords(table.lookupRecords, target);
    }
};

export const collectChainingLookupIndices = (subtable: unknown, target: Set<number>) => {
    if (!subtable || typeof subtable !== "object") {
        return;
    }
    const table = subtable as Record<string, unknown>;
    const format = typeof table.version === "number"
        ? Number(table.version)
        : typeof table.substFormat === "number"
            ? Number(table.substFormat)
            : 1;

    if (format === 1) {
        const chainRuleSets = materialize<unknown>(table.chainRuleSets);
        for (const ruleSet of chainRuleSets) {
            const rules = materialize<{ lookupRecords?: unknown }>(ruleSet);
            for (const rule of rules) {
                addLookupRecords(rule.lookupRecords, target);
            }
        }
        return;
    }

    if (format === 2) {
        const chainClassSet = materialize<unknown>(table.chainClassSet);
        for (const classRules of chainClassSet) {
            const rules = materialize<{ lookupRecords?: unknown }>(classRules);
            for (const rule of rules) {
                addLookupRecords(rule.lookupRecords, target);
            }
        }
        return;
    }

    if (format === 3) {
        addLookupRecords(table.lookupRecords, target);
    }
};

export const processLookupByIndex = (
    lookupIndex: number,
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
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
    context: GSUBContext,
) => {
    if (!lookup || typeof lookup.lookupType !== "number") {
        return;
    }
    const subTables = getSubTables(lookup);
    switch (lookup.lookupType) {
        case 1:
            handleSingleSubstitution(subTables, tag, isDefaultOn, context);
            break;
        case 3:
            handleAlternateSubstitution(subTables, tag, isDefaultOn, context);
            break;
        case 4:
            handleLigatureSubstitution(subTables, tag, isDefaultOn, context);
            break;
        case 5:
            handleContextLookup(subTables, tag, isDefaultOn, context);
            break;
        case 6:
            handleChainingContextLookup(subTables, tag, isDefaultOn, context);
            break;
        case 7:
            handleExtensionLookup(subTables, tag, isDefaultOn, context);
            break;
        default:
            break;
    }
};

export const handleSingleSubstitution = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
) => {
    const { glyphToCodepoints } = context;
    for (const subtable of subTables) {
        if (!subtable || typeof subtable !== "object") {
            continue;
        }
        const table = subtable as {
            coverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            deltaGlyphID?: number;
            substitute?: unknown;
            version?: number;
            substFormat?: number;
        };
        const coverageGlyphs = coverageToGlyphs(table.coverage);
        if (!coverageGlyphs.length) {
            continue;
        }

        const format = table.version ?? table.substFormat;
        const usesDelta = typeof table.deltaGlyphID === "number" && (!format || format === 1);
        if (usesDelta) {
            for (const glyph of coverageGlyphs) {
                const codepoints = glyphToCodepoints.get(glyph);
                if (!codepoints?.length) {
                    continue;
                }
                const subGlyph = glyph + (table.deltaGlyphID as number);
                recordGlyphMapping(subGlyph, codepoints, glyphToCodepoints);
                emitVariant(codepoints, tag, isDefaultOn, context);
            }
            continue;
        }

        const substitutes = materialize<number>(table.substitute);
        for (let i = 0; i < coverageGlyphs.length && i < substitutes.length; i++) {
            const subGlyph = substitutes[i];
            if (typeof subGlyph !== "number") {
                continue;
            }
            const glyph = coverageGlyphs[i];
            const codepoints = glyphToCodepoints.get(glyph);
            if (!codepoints?.length) {
                continue;
            }
            recordGlyphMapping(subGlyph, codepoints, glyphToCodepoints);
            emitVariant(codepoints, tag, isDefaultOn, context);
        }
    }
};

export const handleAlternateSubstitution = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
) => {
    const { glyphToCodepoints } = context;
    for (const subtable of subTables) {
        if (!subtable || typeof subtable !== "object") {
            continue;
        }
        const table = subtable as {
            coverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            alternateSet?: unknown;
        };
        const coverageGlyphs = coverageToGlyphs(table.coverage);
        if (!coverageGlyphs.length) {
            continue;
        }
        const alternateSets = materialize<unknown>(table.alternateSet);
        for (let i = 0; i < coverageGlyphs.length && i < alternateSets.length; i++) {
            const baseGlyph = coverageGlyphs[i];
            const baseCodepoints = glyphToCodepoints.get(baseGlyph);
            if (!baseCodepoints?.length) {
                continue;
            }
            const alternates = materialize<number>(alternateSets[i]);
            if (!alternates.length) {
                continue;
            }
            for (const alternateGlyph of alternates) {
                if (typeof alternateGlyph !== "number") {
                    continue;
                }
                recordGlyphMapping(alternateGlyph, baseCodepoints, glyphToCodepoints);
            }
            emitVariant(baseCodepoints, tag, isDefaultOn, context);
        }
    }
};

export const handleLigatureSubstitution = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
) => {
    const { glyphToCodepoints } = context;
    for (const subtable of subTables) {
        if (!subtable || typeof subtable !== "object") {
            continue;
        }
        const table = subtable as {
            coverage?: { glyphs?: number[]; rangeRecords?: { start: number; end: number }[] };
            ligatureSets?: unknown;
        };
        const coverageGlyphs = coverageToGlyphs(table.coverage);
        if (!coverageGlyphs.length) {
            continue;
        }
        const ligatureSets = materialize<unknown>(table.ligatureSets);
        for (let i = 0; i < coverageGlyphs.length && i < ligatureSets.length; i++) {
            const startGlyph = coverageGlyphs[i];
            const ligatures = materialize<{ glyph: number; components: number[] }>(ligatureSets[i]);
            for (const ligature of ligatures) {
                if (!ligature || typeof ligature.glyph !== "number" || !Array.isArray(ligature.components)) {
                    continue;
                }
                const sequenceGlyphs = [startGlyph, ...ligature.components];
                const codepoints = glyphSequenceToCodepoints(sequenceGlyphs, glyphToCodepoints);
                if (!codepoints.length) {
                    continue;
                }
                recordGlyphMapping(ligature.glyph, codepoints, glyphToCodepoints);
                emitVariant(codepoints, tag, isDefaultOn, context);
            }
        }
    }
};

export const handleContextLookup = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
) => {
    const nested = new Set<number>();
    for (const subtable of subTables) {
        collectContextLookupIndices(subtable, nested);
    }
    nested.forEach((index) => processLookupByIndex(index, tag, isDefaultOn, context));
};

export const handleChainingContextLookup = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
) => {
    const nested = new Set<number>();
    for (const subtable of subTables) {
        collectChainingLookupIndices(subtable, nested);
    }
    nested.forEach((index) => processLookupByIndex(index, tag, isDefaultOn, context));
};

export const handleExtensionLookup = (
    subTables: unknown[],
    tag: string,
    isDefaultOn: boolean,
    context: GSUBContext,
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