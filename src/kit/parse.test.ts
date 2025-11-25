import * as Font from "fontkit";
import { describe, it } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseFont } from "./parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("parseFont", () => {
    it("should parse a font", async () => {
        const fontPath = path.resolve(__dirname, "NotoSerif-VariableFont_wdth,wght.ttf");
        const uint8Arr: Uint8Array = await fs.readFile(fontPath);
        const buffer = Buffer.from(uint8Arr);
        const font = Font.create(buffer);
        console.log("Font loaded:", font);
        if (font.type === "TTF" || font.type === "WOFF" || font.type === "WOFF2") {
            const result = parseFont(font);
            console.log(JSON.stringify({
                glyphs: result.glyphs,
                markAdjacencies: result.markAdjacencies.map(ma => ({
                    from: Array.from(ma.from),
                    to: Array.from(ma.to),
                })),
            }));
        }
        debugger;
    });
});