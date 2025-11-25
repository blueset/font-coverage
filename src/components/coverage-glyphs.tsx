import { useFontStore } from "@/store";
import { useMemo } from "react";
import { CoverageItem } from "./coverage-item";

export interface CoverageGlyphsProps {
  glyphSet: {
    name: string;
    glyphs: {
      codepoints: number[];
      features?: string[];
    }[];
  };
}

export function CoverageGlyphs({ glyphSet }: CoverageGlyphsProps) {
  const { glyphsSet: inputGlyphsSet, markAdjacencies } = useFontStore();

  const { coverage, missing } = useMemo(() => {
    if (!inputGlyphsSet) {
      return { coverage: 0, missing: [] };
    }
    let covered = 0;
    const missingGlyphs = [];
    for (const glyph of glyphSet.glyphs) {
      let key = glyph.codepoints.join(",");
      if (glyph.features) {
        key += "-" + [...glyph.features].sort().join(",");
      }
      if (inputGlyphsSet.has(key)) {
        covered++;
        continue;
      }

      if (!glyph.features?.length && markAdjacencies) {
        const codepoints = [...glyph.codepoints];
        while (codepoints.length > 1) {
          if (
            markAdjacencies.some(
              (ma) =>
                ma.from.has(codepoints[0].toString()) &&
                ma.to.has(codepoints[1].toString())
            )
          ) {
            codepoints.shift();
          } else {
            break;
          }
        }
        if (
          codepoints.length === 1 &&
          inputGlyphsSet.has(codepoints[0].toString())
        ) {
          covered++;
          continue;
        }
      }

      missingGlyphs.push(glyph);
    }
    return { coverage: covered, missing: missingGlyphs };
  }, [glyphSet, inputGlyphsSet, markAdjacencies]);

  if (!inputGlyphsSet || !coverage) {
    return null;
  }

  return (
    <CoverageItem
      name={glyphSet.name}
      coverage={coverage}
      total={glyphSet.glyphs.length}
      missingGlyphs={missing}
    />
  );
}
