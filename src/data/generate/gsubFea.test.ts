import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import {
    parseGsubFea,
    type GlyphClassDefinition,
    type GlyphGroup,
    type GlyphLiteral,
    type SubstituteByStatement,
    type SubstituteFromStatement,
} from "./gsubFea";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("parseGsubFea", () => {
    it("parses simple feature with substitution", () => {
        const fea = `
            languagesystem DFLT dflt;
            @FIGS = [\\1 \\2];
            feature liga {
                substitute \\1 \\2 by \\3;
            } liga;
        `;

        const result = parseGsubFea(fea);
        expect(result.globalClasses).toHaveLength(1);
        expect(result.globalClasses[0]?.name).toBe("FIGS");
        expect(result.features).toHaveLength(1);
        const liga = result.features[0];
        expect(liga.tag).toBe("liga");
        expect(liga.statements).toHaveLength(1);
        const substitution = liga.statements[0] as SubstituteByStatement;
        expect(substitution.mode).toBe("by");
        expect(substitution.inputs).toHaveLength(2);
        expect((substitution.inputs[0] as GlyphLiteral).value).toBe("\\1");
        expect((substitution.replacements[0] as GlyphLiteral).value).toBe("\\3");
    });

    it("captures glyph classes, alternates, and marked glyphs", () => {
        const fea = `
            feature frac {
                @NUMERATOR = [\\9377 \\9383];
                @DENOMINATOR = [\\9384 \\9393];
                substitute [\\104 @DENOMINATOR] @NUMERATOR' by @DENOMINATOR;
                substitute \\9377 from [@NUMERATOR \\777];
            } frac;
        `;

        const result = parseGsubFea(fea);
        expect(result.globalClasses).toHaveLength(0);
        const statements = result.features[0]?.statements ?? [];
        expect(statements.length).toBe(4);

        const classStatements = statements.filter((stmt): stmt is GlyphClassDefinition => stmt.type === "glyphClass");
        const substituteStatements = statements.filter((stmt): stmt is SubstituteByStatement | SubstituteFromStatement => stmt.type === "substitute");

        const numerator = classStatements[0];
        expect(numerator.name).toBe("NUMERATOR");
        const substitutes = substituteStatements.find((stmt) => stmt.mode === "by") as SubstituteByStatement;
        expect(substitutes.inputs).toHaveLength(2);
        const firstInput = substitutes.inputs[0] as GlyphGroup;
        expect(firstInput.kind).toBe("group");
        expect(firstInput.items.length).toBe(2);
        const secondInput = substitutes.inputs[1];
        expect(secondInput.mark).toBe(true);
        const replacements = substitutes.replacements[0];
        expect(replacements.kind).toBe("class");
        const alternate = substituteStatements.find((stmt) => stmt.mode === "from") as SubstituteFromStatement;
        expect(alternate.mode).toBe("from");
        expect(alternate.alternates.length).toBe(2);
    });

    it("parses AJ17 GSUB feature file", async () => {
        const feaPath = path.resolve(__dirname, "..", "aj17-gsub.fea");
        const feaText = await fs.readFile(feaPath, "utf8");
        const result = parseGsubFea(feaText);
        // console.log(JSON.stringify(result));
        expect(result.features.length).toBeGreaterThan(0);
        result.features.forEach((feature) => {
            const statements: Record<string, number> = {};
            feature.statements.forEach((stmt) => {
                if (stmt.type !== "substitute" || (stmt as SubstituteByStatement | SubstituteFromStatement).mode !== "by") return;
                const stmtSub = stmt as SubstituteByStatement;
                const key = stmtSub.inputs.map(i => i.kind).join(",") + " -> " + stmtSub.replacements.map(r => r.kind).join(",");
                statements[key] = (statements[key] || 0) + 1;
            });
            console.log(`Feature ${feature.tag}:`, statements);
        });
    });
});
