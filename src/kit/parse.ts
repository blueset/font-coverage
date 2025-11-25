import type { Font } from "fontkit";
import type { GlyphInfo, MarkAdjacency } from "./type";
import type { GSUBContext } from "./gsub";
import {
  codepointKey,
  processLookupByIndex as processGSUBLookupByIndex,
  recordGlyphMapping,
} from "./gsub";
import { processLookupByIndex as processGPOSLookupByIndex } from "./gpos";
import type { GPOSContext } from "./gpos";
const defaultOnFeatures = new Set([
  "locl",
  "rvrn",
  "hngl",
  "hojo",
  "jp04",
  "jp78",
  "jp83",
  "jp90",
  "nlck",
  "smpl",
  "tnam",
  "trad",
  "ltrm",
  "ltra",
  "rtlm",
  "rtla",
  "ccmp",
  "stch",
  "nukt",
  "akhn",
  "rphf",
  "pref",
  "rkrf",
  "abvf",
  "blwf",
  "half",
  "pstf",
  "vatu",
  "cfar",
  "cjct",
  "med2",
  "fin2",
  "fin3",
  "ljmo",
  "vjmo",
  "tjmo",
  "abvs",
  "blws",
  "calt",
  "clig",
  "fina",
  "haln",
  "init",
  "isol",
  "jalt",
  "liga",
  "medi",
  "mset",
  "pres",
  "psts",
  "rand",
  "rclt",
  "rlig",
  "vert",
  "vrt2",
  "valt",
  "curs",
  "dist",
  "kern",
  "vkrn",
  "mark",
  "abvm",
  "blwm",
  "mkmk",
]);

export function parseFont(font: Font): {
  glyphs: GlyphInfo[];
  markAdjacencies: MarkAdjacency[];
} {
  const glyphs: GlyphInfo[] = [];
  const glyphsKeySet = new Set<string>();
  const markAdjacencies: MarkAdjacency[] = [];

  const glyphToCodepoints = new Map<number, number[]>();

  for (let i = 0; i < font.numGlyphs; i++) {
    for (const codepoint of font._cmapProcessor.codePointsForGlyph(i)) {
      const stored = recordGlyphMapping(i, [codepoint], glyphToCodepoints);
      const key = codepointKey(stored);
      if (!glyphsKeySet.has(key)) {
        glyphsKeySet.add(key);
        glyphs.push({ codepoints: [...stored] });
      }
    }
  }

  if (font.GSUB && font.GSUB.featureList?.length && font.GSUB.lookupList) {
    const lookupList = font.GSUB.lookupList;
    const seenLookups = new Set<string>();
    const gsubContext: GSUBContext = {
      glyphs,
      glyphsKeySet,
      glyphToCodepoints,
      lookupList,
      seenLookups,
    };

    for (const featureRecord of font.GSUB.featureList) {
      const tag = featureRecord.tag;
      const isDefaultOn = defaultOnFeatures.has(tag);
      const lookupIndexes = featureRecord.feature.lookupListIndexes ?? [];
      for (const lookupIndex of lookupIndexes) {
        processGSUBLookupByIndex(lookupIndex, tag, isDefaultOn, gsubContext);
      }
    }
  }

  if (font.GPOS && font.GPOS.featureList?.length && font.GPOS.lookupList) {
    const lookupList = font.GPOS.lookupList;
    const seenLookups = new Set<string>();

    const gposContext: GPOSContext = {
      markAdjacencies,
      glyphToCodepoints,
      lookupList,
      seenLookups,
    };

    for (const featureRecord of font.GPOS.featureList) {
      const tag = featureRecord.tag;
      if (tag !== "mark" && tag !== "mkmk") continue;
      const isDefaultOn = defaultOnFeatures.has(tag);
      const lookupIndexes = featureRecord.feature.lookupListIndexes ?? [];
      for (const lookupIndex of lookupIndexes) {
        processGPOSLookupByIndex(lookupIndex, tag, isDefaultOn, gposContext);
      }
    }
  }

  return { glyphs, markAdjacencies };
}
