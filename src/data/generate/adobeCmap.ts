import fs from "fs/promises";
import path from "path";
import { parseGsubFea } from "./gsubFea";
import {
  cidsToCodepoints,
  expandGlyphClassDefinition,
  iterateInputs,
} from "./gsubUtils";

export async function getAdobeCJK(
  cid2CodeUrl: string,
  cidUTF16Index: number,
  variationSequencesUrl: string,
  feaUrl: string,
  name: string,
  outputFileName: string
) {
  const cidToCodepointsMapping = new Map<number, number[][]>();

  const cidResponse = await fetch(cid2CodeUrl);
  const cidText = await cidResponse.text();
  const cidTable = cidText
    .split("\n")
    .filter((line) => line.trim().length > 0 && !line.startsWith("#"))
    .map((line) => {
      const columns = line.split("\t");
      const cid = parseInt(columns[0], 10);

      if (
        !columns[cidUTF16Index].match(/^([0-9A-Fa-f]{4,})(,[0-9A-Fa-f]{4,})*$/)
      ) {
        return null;
      }

      const codepoints = columns[cidUTF16Index]
        .split(",")
        .map((cpStr) => parseInt(cpStr, 16));
      return { cid, codepoints };
    })
    .filter(
      (entry): entry is { cid: number; codepoints: number[] } => entry !== null
    );

  for (const { cid, codepoints } of cidTable) {
    if (!cidToCodepointsMapping.has(cid)) {
      cidToCodepointsMapping.set(cid, []);
    }
    codepoints.forEach((cp) => {
      cidToCodepointsMapping.get(cid)!.push([cp]);
    });
  }

  const vsResponse = await fetch(variationSequencesUrl);
  const vsText = await vsResponse.text();

  const vsTable = vsText
    .split("\n")
    .filter((line) => line.trim().length > 0 && !line.startsWith("#"))
    .map((line) => {
      const columns = line.split(";").map((col) => col.trim());
      const cid = parseInt(columns[2].replace("CID+", ""), 10);
      const codepoints = columns[0]
        .split(" ")
        .map((cpStr) => parseInt(cpStr, 16));
      return { cid, codepoints };
    });

  for (const { cid, codepoints } of vsTable) {
    if (!cidToCodepointsMapping.has(cid)) {
      cidToCodepointsMapping.set(cid, []);
    }
    cidToCodepointsMapping.get(cid)!.push(codepoints);
  }

  const result: {
    codepoints: number[];
    features?: string[];
  }[] = [];
  cidToCodepointsMapping.forEach((codepoints) =>
    codepoints.forEach((cps) => {
      result.push({
        codepoints: cps,
      });
    })
  );

  const feaResponse = await fetch(feaUrl);
  const feaText = await feaResponse.text();
  const feaAst = parseGsubFea(feaText);

  for (const feature of feaAst.features) {
    if (feature.tag === "aalt" || feature.tag === "nalt") {
      continue;
    }
    const classes: Record<string, string[]> = {};
    for (const statement of feature.statements) {
      if (statement.type === "glyphClass") {
        expandGlyphClassDefinition(statement, classes);
        continue;
      }
      if (statement.type !== "substitute") continue;
      if (statement.mode !== "by") continue;
      const inputSequences = iterateInputs(statement.inputs, classes);
      if (
        feature.tag === "dlig" &&
        JSON.stringify(statement).includes("\\6631")
      )
        debugger;
      for (const inputSequence of inputSequences) {
        const outputSequence = statement.replacements.flatMap((replacement) => {
          if (replacement.kind === "glyph") {
            return [replacement.value];
          }
          return [];
        });
        const inputCodepointsSets = cidsToCodepoints(
          inputSequence,
          cidToCodepointsMapping
        );
        for (const inputCodepoints of inputCodepointsSets) {
          if (inputCodepoints.length === 1 && outputSequence.length === 1) {
            if (!outputSequence[0].match(/^\\\d+$/)) {
              continue;
            }
            const outputCid = parseInt(outputSequence[0].replace("\\", ""), 10);
            if (!cidToCodepointsMapping.has(outputCid)) {
              cidToCodepointsMapping.set(outputCid, []);
            }
            cidToCodepointsMapping.get(outputCid)!.push([inputCodepoints[0]]);
          }
          if (inputCodepoints.length > 0) {
            result.push({
              codepoints: inputCodepoints,
              features: [feature.tag],
            });
          }
        }
      }
    }
  }

  const uniqueSet = new Set<string>();
  const uniqueResult: {
    codepoints: number[];
    features?: string[];
  }[] = [];
  for (const glyph of result) {
    let key = glyph.codepoints.join(",");
    if (glyph.features) {
      key += "-" + [...glyph.features].sort().join(",");
    }
    if (!uniqueSet.has(key)) {
      uniqueSet.add(key);
      uniqueResult.push(glyph);
    }
  }

  if (uniqueResult.length > 0) {
    const filePath = path.join(
      import.meta.dirname,
      "..",
      "adobeCmap",
      outputFileName
    );
    await fs.writeFile(
      filePath,
      JSON.stringify({ name, glyphs: uniqueResult })
    );
    console.log(`Written ${filePath}`);
  }
}

export async function getAdobeJapan17() {
  console.log("Generating Adobe Japan1-7 glyph set...");
  await getAdobeCJK(
    "https://github.com/adobe-type-tools/cmap-resources/raw/refs/heads/master/Adobe-Japan1-7/cid2code.txt",
    26, // Col 26, UniJISX02132004-UTF32
    "https://github.com/adobe-type-tools/Adobe-Japan1/raw/refs/heads/master/Adobe-Japan1_sequences.txt",
    "https://github.com/adobe-type-tools/Adobe-Japan1/raw/refs/heads/master/GSUB/aj17-gsub.fea",
    "Adobe Japan1-7",
    "adobe-japan1-7.json"
  );
}

export async function getAdobeGB16() {
  console.log("Generating Adobe GB1-6 glyph set...");
  await getAdobeCJK(
    "https://github.com/adobe-type-tools/cmap-resources/raw/refs/heads/master/Adobe-GB1-6/cid2code.txt",
    13, // Col 13, UniGB-UTF32
    "https://github.com/adobe-type-tools/Adobe-GB1/raw/refs/heads/master/Adobe-GB1_sequences.txt",
    "https://github.com/adobe-type-tools/Adobe-GB1/raw/refs/heads/master/GSUB/ag16-gsub.fea",
    "Adobe GB1-6",
    "adobe-gb1-6.json"
  );
}

export async function getAdobeCNS17() {
  console.log("Generating Adobe CNS1-7 glyph set...");
  await getAdobeCJK(
    "https://github.com/adobe-type-tools/cmap-resources/raw/refs/heads/master/Adobe-CNS1-7/cid2code.txt",
    11, // Col 11, UniCNS-UTF32
    "https://github.com/adobe-type-tools/Adobe-CNS1/raw/refs/heads/master/Adobe-CNS1_sequences.txt",
    "https://github.com/adobe-type-tools/Adobe-CNS1/raw/refs/heads/master/GSUB/ac17-gsub.fea",
    "Adobe CNS1-7",
    "adobe-cns1-7.json"
  );
}

export async function getAdobeKR9() {
  console.log("Generating Adobe KR-9 glyph set...");
  await getAdobeCJK(
    "https://github.com/adobe-type-tools/cmap-resources/raw/refs/heads/master/Adobe-KR-9/cid2code.txt",
    3, // Col 3, UniAKR-UTF32
    "https://github.com/adobe-type-tools/Adobe-KR/raw/refs/heads/master/Adobe-KR_sequences.txt",
    "https://github.com/adobe-type-tools/Adobe-KR/raw/refs/heads/master/GSUB/akr9-gsub.fea",
    "Adobe KR-9",
    "adobe-kr-9.json"
  );
}

export async function getAdobeManga10() {
  console.log("Generating Adobe Manga1-0 glyph set...");
  await getAdobeCJK(
    "https://github.com/adobe-type-tools/cmap-resources/raw/refs/heads/master/Adobe-Manga1-0/cid2code.txt",
    3, // Col 3, UniManga-UTF32
    "https://github.com/adobe-type-tools/Adobe-Manga1/raw/refs/heads/main/Adobe-Manga1_sequences.txt",
    "https://github.com/adobe-type-tools/Adobe-Manga1/raw/refs/heads/main/GSUB/Adobe-Manga1-0-gsub.fea",
    "Adobe Manga1-0",
    "adobe-manga1-0.json"
  );
}
