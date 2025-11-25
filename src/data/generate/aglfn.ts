import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_URL = "https://github.com/adobe-type-tools/agl-aglfn/raw/refs/heads/master/aglfn.txt";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getAglfn() {
    console.log("Generating AGLFN glyph set...");

    const response = await fetch(SOURCE_URL);
    if (!response.ok) {
        throw new Error(`Failed to download AGLFN data: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    const glyphMap: Record<string, number> = {};

    // Normalize the upstream glyph list into a name -> code point lookup table.
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) {
            continue;
        }

        const [codeHex, name] = line.split(";").map((part) => part.trim());
        if (!codeHex || !name) {
            continue;
        }

        const codePoint = Number.parseInt(codeHex, 16);
        if (Number.isNaN(codePoint)) {
            continue;
        }

        glyphMap[name] = codePoint;
    }

    const outputPath = path.resolve(__dirname, "../aglfn.json");
    await writeFile(outputPath, `${JSON.stringify(glyphMap, null, 2)}\n`, "utf8");

    console.log(`Wrote ${Object.keys(glyphMap).length} AGLFN mappings to ${outputPath}`);
    return glyphMap;
}