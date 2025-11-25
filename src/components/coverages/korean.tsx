import CP949 from "@/data/nightFurySL2001/korean/CP949.json" with { type: "json" };
import KSX1001 from "@/data/nightFurySL2001/korean/KSX1001.json" with { type: "json" };

import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function KoreanEncodingCoverage() {
  return (
    <CoverageGroup title="Korean Encodings">
      <CoverageEncoding name={CP949.name} ranges={CP949.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={KSX1001.name} ranges={KSX1001.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}
