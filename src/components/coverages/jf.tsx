import JfBase from "@/data/jf/jf_list_base.json" with { type: "json" };
import JfExtCantonese from "@/data/jf/jf_list_ext_cantonese.json" with { type: "json" };
import JfExtJapan from "@/data/jf/jf_list_ext_japan.json" with { type: "json" };
import JfExtNaming from "@/data/jf/jf_list_ext_naming.json" with { type: "json" };
import JfExtSymbols from "@/data/jf/jf_list_ext_symbols.json" with { type: "json" };
import JfExtTaiwan from "@/data/jf/jf_list_ext_taiwan.json" with { type: "json" };
import { CoverageGlyphs } from "../coverage-glyphs";
import { CoverageGroup } from "../coverage-group";

export function JfCoverage() {
  return (
    <CoverageGroup title="JF" warn>
      <CoverageGlyphs glyphSet={JfBase} />
      <CoverageGlyphs glyphSet={JfExtCantonese} />
      <CoverageGlyphs glyphSet={JfExtJapan} />
      <CoverageGlyphs glyphSet={JfExtNaming} />
      <CoverageGlyphs glyphSet={JfExtSymbols} />
      <CoverageGlyphs glyphSet={JfExtTaiwan} />
    </CoverageGroup>
  );
}
