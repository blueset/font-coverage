import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import GlyphData from "../GlyphData.json" assert { type: "json" };
import { parseUniSequence, parseUSingle } from "./aglfnUtils";

const JF_BASE_URL = "https://github.com/justfont/jf7000/raw/refs/heads/main/charset/0.9/";

const jfSets = [
    { name: "jf 7000 當務字集基本包", file: "list_base.txt" },
    { name: "jf 7000 當務字集粵語常用包", file: "list_ext_cantonese.txt" },
    { name: "jf 7000 當務字集日語常用包", file: "list_ext_japan.txt" },
    { name: "jf 7000 當務字集臺灣命名常用包", file: "list_ext_naming.txt" },
    { name: "jf 7000 當務字集符號擴充包", file: "list_ext_symbols.txt" },
    { name: "jf 7000 當務字集本土語言常用包", file: "list_ext_taiwan.txt" },
];


export async function getJfSets() {
    const glyphNodes = (GlyphData as {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        elements: { elements: any[];
        }[];
    }).elements[1].elements;
    const glyphDataMapping: Record<string, { 
        name: string;
        unicode?: string;
        decompose?: string;
        production?: string;
        altNames?: string;
    }> = {};
    glyphNodes.forEach((glyph: { attributes: { name: string } }) => {
        glyphDataMapping[glyph.attributes.name] = glyph.attributes;
    });


    const resolveCodepoints = (component: string): number[] | null => {
        if (!component) {
            return null;
        }
        const mapped = glyphDataMapping[component];
        if (typeof mapped?.unicode === "string") {
            return [parseInt(mapped.unicode, 16)];
        }
        const uni = parseUniSequence(component);
        if (uni) {
            return uni;
        }
        const single = parseUSingle(component);
        if (single) {
            return single;
        }
        const altNameObj = Object.values(glyphDataMapping).find((g) => g.altNames?.split(",").map(n => n.trim()).includes(component) && g.unicode);
        if (altNameObj) {
            return [parseInt(altNameObj.unicode!, 16)];
        }
        return null;
    };


    for (const set of jfSets) {
        const response = await fetch(`${JF_BASE_URL}${set.file}`);
        const text = await response.text();
        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0 && !line.startsWith("#"));
        const glyphs = lines.map((glyphName) => {
            if (glyphDataMapping[glyphName]?.unicode) {
                return { codepoints: [parseInt(glyphDataMapping[glyphName].unicode!, 16)] };
            }
            const features: string[] = [];
            while (glyphName.includes(".")) {
                const lastVariant = glyphName.substring(glyphName.lastIndexOf(".") + 1);
                features.unshift(lastVariant);
                glyphName = glyphName.substring(0, glyphName.lastIndexOf("."));
                if (glyphDataMapping[glyphName]?.unicode) {
                    return { 
                        codepoints: [parseInt(glyphDataMapping[glyphName].unicode!, 16)],
                        ...(features?.length ? { features } : {}),
                    };
                }
            }
            if (glyphName.includes("_")) {
                const glyphs = glyphName.split("_");
                if (glyphs.every(g => resolveCodepoints(g) !== null)) {
                    return { 
                        codepoints: glyphs.flatMap(g => resolveCodepoints(g)!),
                        ...(features?.length ? { features } : {}),
                    };
                }
            }
            const codepoints = resolveCodepoints(glyphName);
            if (codepoints) {
                return {
                    codepoints,
                    ...(features?.length ? { features } : {}),
                };
            }
            console.warn(`Warning: Unable to find codepoint for glyph name "${glyphName}" in JF set "${set.name}"`);
            return null;
        }).filter((entry): entry is { codepoints: number[]; features?: string[] } => entry !== null);

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const outputPath = path.resolve(__dirname, "..", "jf", "jf_" + set.file.replace(/\.txt$/i, ".json"));
        await writeFile(outputPath, `${JSON.stringify({ name: set.name, glyphs })}\n`, "utf8");
        console.log(`Written ${outputPath}`);
    }
}