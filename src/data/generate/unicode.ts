import UnicodeMetadata from "@unicode/unicode-17.0.0";
import Names from "@unicode/unicode-17.0.0/Names";
import type { UnicodeRange } from "@unicode/unicode-17.0.0/decode-ranges";
import fs from "fs/promises";
import path from "path";
import { numberToRanges } from "./rangeUtils";

const blocks = UnicodeMetadata.Block;
const scriptExtensions = UnicodeMetadata.Script_Extensions;

export async function getUnicodeData() {
    const data = {
        blocks: [] as { name: string; ranges: (number | [number, number])[] }[],
        scriptExtensions: [] as { name: string; ranges: (number | [number, number])[] }[],
    };
    
    for (const block of blocks) {
        const displayName = block.replace(/_/g, " ");
        const rangeObjs: UnicodeRange[] = (await import(`@unicode/unicode-17.0.0/Block/${block}/ranges.js`)).default;
        const values = rangeObjs.flatMap((range) => [...range.keys()]).filter(v => Names.has(v));
        const ranges = numberToRanges(values);

        data.blocks.push({ name: displayName, ranges });
    }

    for (const scriptExt of scriptExtensions) {
        const displayName = scriptExt.replace(/_/g, " ");
        const rangeObjs: UnicodeRange[] = (await import(`@unicode/unicode-17.0.0/Script_Extensions/${scriptExt}/ranges.js`)).default;
        const ranges = rangeObjs.map((range): number | [number, number] => {
            if (range.length === 1) {
                return range.begin;
            } else {
                return [range.begin, range.end];
            }
        });

        data.scriptExtensions.push({ name: displayName, ranges });
    }

    for (const [key, value] of Object.entries(data)) {
        const __dirname = import.meta.dirname;
        const outputPath = path.resolve(
            __dirname,
            "..",
            "unicode", `${key}.json`,
        );
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, JSON.stringify(value));
        console.log(`Written ${outputPath}`);
    }
}