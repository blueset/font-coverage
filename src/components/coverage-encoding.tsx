import { useFontStore } from "@/store";
import { useMemo } from "react";
import { CoverageItem } from "./coverage-item";

export type CoverageRange = number | [number, number];

export interface CoverageRangesProps {
  name: string;
  ranges: CoverageRange[];
}

export function CoverageEncoding({ name, ranges }: CoverageRangesProps) {
  const { glyphsSet: inputGlyphsSet } = useFontStore();

  const { coverage, missing, total } = useMemo(() => {
    if (!inputGlyphsSet) {
      return { coverage: 0, missing: [], total: 0 };
    }
    let covered = 0;
    let total = 0;
    const missingCodepoints: number[] = [];
    for (const item of ranges) {
      // Check if glyph is a single codepoint or a range
      if (typeof item === "number") {
        total++;
        if (inputGlyphsSet.has(item.toString())) {
          covered++;
          continue;
        } else {
          missingCodepoints.push(item);
        }
      } else {
        for (let cp = item[0]; cp < item[1]; cp++) {
          total++;
          if (!inputGlyphsSet.has(cp.toString())) {
            missingCodepoints.push(cp);
          } else {
            covered++;
          }
        }
      }
    }

    return { coverage: covered, missing: missingCodepoints, total };
  }, [ranges, inputGlyphsSet]);

  if (!inputGlyphsSet || !coverage) {
    return null;
  }

  return (
    <CoverageItem
      name={name}
      coverage={coverage}
      total={total}
      missingCodepoints={missing}
    />
  );
}
