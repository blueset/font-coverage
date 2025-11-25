import AdobeLatin1 from "@/data/adobe/adobe-latin-1.json" with { type: "json" };
import AdobeLatin2 from "@/data/adobe/adobe-latin-2.json" with { type: "json" };
import AdobeLatin3 from "@/data/adobe/adobe-latin-3.json" with { type: "json" };
import AdobeLatin4Combined from "@/data/adobe/adobe-latin-4-combined.json" with { type: "json" };
import AdobeLatin4Precomposed from "@/data/adobe/adobe-latin-4-precomposed.json" with { type: "json" };
import AdobeLatin5Combined from "@/data/adobe/adobe-latin-5-combined.json" with { type: "json" };
import AdobeLatin5Precomposed from "@/data/adobe/adobe-latin-5-precomposed.json" with { type: "json" };
import AdobeCyrillic1 from "@/data/adobe/adobe-cyrillic-1.json" with { type: "json" };
import AdobeCyrillic2 from "@/data/adobe/adobe-cyrillic-2.json" with { type: "json" };
import AdobeCyrillic3Combined from "@/data/adobe/adobe-cyrillic-3-combined.json" with { type: "json" };
import AdobeCyrillic3Precomposed from "@/data/adobe/adobe-cyrillic-3-precomposed.json" with { type: "json" };
import AdobeGreek1 from "@/data/adobe/adobe-greek-1.json" with { type: "json" };
import AdobeGreek2 from "@/data/adobe/adobe-greek-2.json" with { type: "json" };
import AdobeArabicCoreCharacters from "@/data/adobe/adobe-arabic-core-characters.json" with { type: "json" };
import AdobeArabicCoreCombinations from "@/data/adobe/adobe-arabic-core-combinations.json" with { type: "json" };
import AdobeArabicExtended from "@/data/adobe/adobe-arabic-extended.json" with { type: "json" };
import AdobeUyghurKazakhKyrgyz from "@/data/adobe/adobe-uyghur-kazakh-kyrgyz.json" with { type: "json" };
import { CoverageGlyphs } from "../coverage-glyphs";
import { CoverageGroup } from "../coverage-group";

export function AdobeLatinCoverage() {
  return (
    <CoverageGroup title="Adobe Latin" warn>
      <CoverageGlyphs glyphSet={AdobeLatin1} />
      <CoverageGlyphs glyphSet={AdobeLatin2} />
      <CoverageGlyphs glyphSet={AdobeLatin3} />
      <CoverageGlyphs glyphSet={AdobeLatin4Combined} />
      <CoverageGlyphs glyphSet={AdobeLatin4Precomposed} />
      <CoverageGlyphs glyphSet={AdobeLatin5Combined} />
      <CoverageGlyphs glyphSet={AdobeLatin5Precomposed} />
    </CoverageGroup>
  );
}

export function AdobeCyrillicCoverage() {
  return (
    <CoverageGroup title="Adobe Cyrillic" warn>
      <CoverageGlyphs glyphSet={AdobeCyrillic1} />
      <CoverageGlyphs glyphSet={AdobeCyrillic2} />
      <CoverageGlyphs glyphSet={AdobeCyrillic3Combined} />
      <CoverageGlyphs glyphSet={AdobeCyrillic3Precomposed} />
    </CoverageGroup>
  );
}

export function AdobeGreekCoverage() {
  return (
    <CoverageGroup title="Adobe Greek" warn>
      <CoverageGlyphs glyphSet={AdobeGreek1} />
      <CoverageGlyphs glyphSet={AdobeGreek2} />
    </CoverageGroup>
  );
}

export function AdobeArabicCoverage() {
  return (
    <CoverageGroup title="Adobe Arabic" warn>
      <CoverageGlyphs glyphSet={AdobeArabicCoreCharacters} />
      <CoverageGlyphs glyphSet={AdobeArabicCoreCombinations} />
      <CoverageGlyphs glyphSet={AdobeArabicExtended} />
      <CoverageGlyphs glyphSet={AdobeUyghurKazakhKyrgyz} />
    </CoverageGroup>
  );
}
