import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import aglfn from "../aglfn.json" assert { type: "json" };
import { parseUniSequence, parseUSingle } from "./aglfnUtils";

interface GFGlyphInfo {
    codepoints: number[];
    features?: string[];
    gfVariants?: string[];
}

interface GFSetDefinition {
    name: string;
    file: string;
}

const GF_BASE_URL = "https://github.com/googlefonts/glyphsets/raw/main/data/results/txt/prod-names/";

const FEATURE_ALIAS: Record<string, string> = {
    sc: "smcp",
    tf: "tnum",
    alt: "cv01"
};

const gfSets: GFSetDefinition[] = [
    { name: "GF Arabic Core", file: "GF_Arabic_Core.txt" },
    { name: "GF Arabic Plus", file: "GF_Arabic_Plus.txt" },
    { name: "GF Cyrillic Core", file: "GF_Cyrillic_Core.txt" },
    { name: "GF Cyrillic Historical", file: "GF_Cyrillic_Historical.txt" },
    { name: "GF Cyrillic Plus", file: "GF_Cyrillic_Plus.txt" },
    { name: "GF Cyrillic Pro", file: "GF_Cyrillic_Pro.txt" },
    { name: "GF Greek Ancient Musical Symbols", file: "GF_Greek_AncientMusicalSymbols.txt" },
    { name: "GF Greek Archaic", file: "GF_Greek_Archaic.txt" },
    { name: "GF Greek Coptic", file: "GF_Greek_Coptic.txt" },
    { name: "GF Greek Core", file: "GF_Greek_Core.txt" },
    { name: "GF Greek Expert", file: "GF_Greek_Expert.txt" },
    { name: "GF Greek Plus", file: "GF_Greek_Plus.txt" },
    { name: "GF Greek Pro", file: "GF_Greek_Pro.txt" },
    { name: "GF Latin African", file: "GF_Latin_African.txt" },
    { name: "GF Latin Beyond", file: "GF_Latin_Beyond.txt" },
    { name: "GF Latin Core", file: "GF_Latin_Core.txt" },
    { name: "GF Latin Kernel", file: "GF_Latin_Kernel.txt" },
    { name: "GF Latin Plus", file: "GF_Latin_Plus.txt" },
    { name: "GF Latin PriAfrican", file: "GF_Latin_PriAfrican.txt" },
    { name: "GF Latin Vietnamese", file: "GF_Latin_Vietnamese.txt" },
    { name: "GF Phonetics APA", file: "GF_Phonetics_APA.txt" },
    { name: "GF Phonetics Disordered Speech", file: "GF_Phonetics_DisorderedSpeech.txt" },
    { name: "GF Phonetics IPA Historical", file: "GF_Phonetics_IPAHistorical.txt" },
    { name: "GF Phonetics IPA Standard", file: "GF_Phonetics_IPAStandard.txt" },
    { name: "GF Phonetics Sino Extension", file: "GF_Phonetics_SinoExt.txt" },
    { name: "GF TransLatin Arabic", file: "GF_TransLatin_Arabic.txt" },
    { name: "GF TransLatin Pinyin", file: "GF_TransLatin_Pinyin.txt" },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const aglfnMap = aglfn as Record<string, number>;

const splitIntoNames = (base: string): string[] => base
    .split("_")
    .map((segment) => segment.trim())
    .filter(Boolean);

const resolveCodepoints = (component: string): number[] | null => {
    if (!component) {
        return null;
    }
    const mapped = aglfnMap[component];
    if (typeof mapped === "number") {
        return [mapped];
    }
    const uni = parseUniSequence(component);
    if (uni) {
        return uni;
    }
    const single = parseUSingle(component);
    if (single) {
        return single;
    }
    return null;
};

const normalizeFeature = (variant: string): string | undefined => {
    const trimmed = variant.trim();
    if (!trimmed) {
        return undefined;
    }
    const lower = trimmed.toLowerCase();
    if (FEATURE_ALIAS[lower]) {
        return FEATURE_ALIAS[lower];
    }
    if (trimmed.length === 4) {
        return lower;
    }
    return undefined;
};

export async function getGfSets() {
    const gfVariants = new Set<string>();
    for (const set of gfSets) {
        const url = `${GF_BASE_URL}${set.file}`;
        console.log(`Downloading GF glyph set: ${set.name}...`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download GF glyph set ${set.name}: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        const glyphNames = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith("#"));

        const glyphs: GFGlyphInfo[] = [];
        for (const glyphName of glyphNames) {
            const [base, ...variantParts] = glyphName.split(".");
            if (!base) {
                continue;
            }
            const components = splitIntoNames(base);
            const codepoints: number[] = [];
            let isValid = true;
            for (const component of components) {
                const resolved = resolveCodepoints(component);
                if (!resolved) {
                    console.warn(`Unknown glyph component "${component}" in ${glyphName} (${set.name})`);
                    isValid = false;
                    break;
                }
                codepoints.push(...resolved);
            }
            if (!isValid || codepoints.length === 0) {
                continue;
            }

            const features = new Set<string>();
            const glyphVariants = new Set<string>();
            for (const part of variantParts) {
                const feature = normalizeFeature(part);
                if (feature) {
                    features.add(feature);
                    continue;
                }
                const trimmed = part.trim();
                if (!trimmed) {
                    continue;
                }
                glyphVariants.add(trimmed);
                gfVariants.add(trimmed);
            }

            const info: GFGlyphInfo = { codepoints: [...codepoints] };
            if (features.size) {
                info.features = Array.from(features).sort();
            }
            if (glyphVariants.size) {
                info.gfVariants = Array.from(glyphVariants).sort();
            }
            glyphs.push(info);
        }

        const outputPath = path.resolve(__dirname, "..", "gf", set.file.replace(/\.txt$/i, ".json"));
        await writeFile(outputPath, `${JSON.stringify({ name: set.name, glyphs })}\n`, "utf8");
        console.log(`Written ${outputPath}`);
    }

    if (gfVariants.size > 0) {
        const variantsPath = path.resolve(__dirname, "..", "gf", "gfVariants.json");
        await writeFile(variantsPath, `${JSON.stringify(Array.from(gfVariants).sort(), null, 2)}\n`, "utf8");
        console.log(`Written ${variantsPath}`);
    }

    console.log("Done generating GF glyph sets.");
}