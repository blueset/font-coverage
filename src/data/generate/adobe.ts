import type { GlyphInfo } from "../../kit/type";
import fs from "fs/promises";
import path from "path";

// TODO: Handle Adobe variants properly

const glyphSets = [
    { name: "Adobe Latin 1", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-1.txt", },
    { name: "Adobe Latin 2", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-2.txt", },
    { name: "Adobe Latin 3", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-3.txt", },
    { name: "Adobe Latin 4 (Combined)", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-4-combined.txt", },
    { name: "Adobe Latin 4 (Precomposed)", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-4-precomposed.txt", },
    { name: "Adobe Latin 5 (Combined)", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-5-combined.txt", },
    { name: "Adobe Latin 5 (Precomposed)", url: "https://adobe-type-tools.github.io/adobe-latin-charsets/adobe-latin-5-precomposed.txt", },
    { name: "Adobe Greek 1", url: "https://adobe-type-tools.github.io/adobe-greek-charsets/adobe-greek-1.txt", },
    { name: "Adobe Greek 2", url: "https://adobe-type-tools.github.io/adobe-greek-charsets/adobe-greek-2.txt", },
    { name: "Adobe Cyrillic 1", url: "https://adobe-type-tools.github.io/adobe-cyrillic-charsets/adobe-cyrillic-1.txt", },
    { name: "Adobe Cyrillic 2", url: "https://adobe-type-tools.github.io/adobe-cyrillic-charsets/adobe-cyrillic-2.txt", },
    { name: "Adobe Cyrillic 3 (Combined)", url: "https://adobe-type-tools.github.io/adobe-cyrillic-charsets/adobe-cyrillic-3-combined.txt", },
    { name: "Adobe Cyrillic 3 (Precomposed)", url: "https://adobe-type-tools.github.io/adobe-cyrillic-charsets/adobe-cyrillic-3-precomposed.txt", },
    { name: "Adobe Arabic Core (Characters)", url: "https://adobe-type-tools.github.io/adobe-arabic-charsets/adobe-arabic-core-characters.txt", },
    { name: "Adobe Arabic Core (Combinations)", url: "https://adobe-type-tools.github.io/adobe-arabic-charsets/adobe-arabic-core-combinations.txt", },
    { name: "Adobe Uyghur + Kazakh + Kyrgyz Module", url: "https://adobe-type-tools.github.io/adobe-arabic-charsets/adobe-uyghur-kazakh-kyrgyz.txt", },
    { name: "Adobe Arabic Extended Module", url: "https://adobe-type-tools.github.io/adobe-arabic-charsets/adobe-arabic-extended.txt", },
];

export async function getAdobeGlyphSets() {
    const adobeVariants = new Set<string>();
    for (const glyphSet of glyphSets) {
        const response = await fetch(glyphSet.url);
        const text = await response.text();
        const glyphs = text.split("\n").map((line, index) => {
            if (index === 0 || line.trim() === "") {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [codes, _characters, glyphName, ..._rest] = line.split("\t");
            const info: {
                codepoints: number[];
                adobeVariant?: string;
            } = { codepoints: codes.split(",").map((code) => parseInt(code, 16)) };
            if (glyphName.includes(".")) {
                info.adobeVariant = glyphName.split(".").slice(1).join(".");
                adobeVariants.add(info.adobeVariant);
            }
            return info;
        }).filter((glyph) => glyph !== null) as GlyphInfo[];
        const data = { name: glyphSet.name, glyphs };
        const filePath = path.join(import.meta.dirname, "..", "adobe", path.basename(glyphSet.url).replace(".txt", ".json"));
        await fs.writeFile(filePath, JSON.stringify(data));
        console.log(`Written ${filePath}`);
    }

    if (adobeVariants.size > 0) {
        const variantsArray = Array.from(adobeVariants).sort();
        const variantsPath = path.join(import.meta.dirname, "..", "adobe", "adobe-variants.json");
        await fs.writeFile(variantsPath, JSON.stringify(variantsArray));
        console.log(`Written ${variantsPath}`);
    }
}