import AdobeCns1 from "@/data/adobeCmap/adobe-cns1-7.json" with { type: "json" };
import AdobeGb1 from "@/data/adobeCmap/adobe-gb1-6.json" with { type: "json" };
import AdobeJapan1 from "@/data/adobeCmap/adobe-japan1-7.json" with { type: "json" };
import AdobeKr from "@/data/adobeCmap/adobe-kr-9.json" with { type: "json" };
import AdobeManga1 from "@/data/adobeCmap/adobe-manga1-0.json" with { type: "json" };
import { CoverageGlyphs } from "../coverage-glyphs";
import { CoverageGroup } from "../coverage-group";

export function AdobeCmapCoverage() {
  return (
    <CoverageGroup title="Adobe CMAP" warn>
      <CoverageGlyphs glyphSet={AdobeCns1} />
      <CoverageGlyphs glyphSet={AdobeGb1} />
      <CoverageGlyphs glyphSet={AdobeJapan1} />
      <CoverageGlyphs glyphSet={AdobeKr} />
      <CoverageGlyphs glyphSet={AdobeManga1} />
    </CoverageGroup>
  );
}
