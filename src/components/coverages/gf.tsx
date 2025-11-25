import GFArabicCore from "@/data/gf/GF_Arabic_Core.json" with { type: "json" };
import GFArabicPlus from "@/data/gf/GF_Arabic_Plus.json" with { type: "json" };

import GFCyrillicCore from "@/data/gf/GF_Cyrillic_Core.json" with { type: "json" };
import GFCyrillicHistorical from "@/data/gf/GF_Cyrillic_Historical.json" with { type: "json" };
import GFCyrillicPlus from "@/data/gf/GF_Cyrillic_Plus.json" with { type: "json" };
import GFCyrillicPro from "@/data/gf/GF_Cyrillic_Pro.json" with { type: "json" };

import GFGreekAncientMusicalSymbols from "@/data/gf/GF_Greek_AncientMusicalSymbols.json" with { type: "json" };
import GFGreekArchaic from "@/data/gf/GF_Greek_Archaic.json" with { type: "json" };
import GFGreekCoptic from "@/data/gf/GF_Greek_Coptic.json" with { type: "json" };
import GFGreekCore from "@/data/gf/GF_Greek_Core.json" with { type: "json" };
import GFGreekExpert from "@/data/gf/GF_Greek_Expert.json" with { type: "json" };
import GFGreekPlus from "@/data/gf/GF_Greek_Plus.json" with { type: "json" };
import GFGreekPro from "@/data/gf/GF_Greek_Pro.json" with { type: "json" };

import GFLatinAfrican from "@/data/gf/GF_Latin_African.json" with { type: "json" };
import GFLatinBeyond from "@/data/gf/GF_Latin_Beyond.json" with { type: "json" };
import GFLatinCore from "@/data/gf/GF_Latin_Core.json" with { type: "json" };
import GFLatinKernel from "@/data/gf/GF_Latin_Kernel.json" with { type: "json" };
import GFLatinPlus from "@/data/gf/GF_Latin_Plus.json" with { type: "json" };
import GFLatinPriAfrican from "@/data/gf/GF_Latin_PriAfrican.json" with { type: "json" };
import GFLatinVietnamese from "@/data/gf/GF_Latin_Vietnamese.json" with { type: "json" };

import GFPhoneticsAPA from "@/data/gf/GF_Phonetics_APA.json" with { type: "json" };
import GFPhoneticsDisorderedSpeech from "@/data/gf/GF_Phonetics_DisorderedSpeech.json" with { type: "json" };
import GFPhoneticsIPAHistorical from "@/data/gf/GF_Phonetics_IPAHistorical.json" with { type: "json" };
import GFPhoneticsIPAStandard from "@/data/gf/GF_Phonetics_IPAStandard.json" with { type: "json" };
import GFPhoneticsSinoExt from "@/data/gf/GF_Phonetics_SinoExt.json" with { type: "json" };

import GFTransLatinArabic from "@/data/gf/GF_TransLatin_Arabic.json" with { type: "json" };
import GFTransLatinPinyin from "@/data/gf/GF_TransLatin_Pinyin.json" with { type: "json" };

import { CoverageGlyphs } from "../coverage-glyphs";
import { CoverageGroup } from "../coverage-group";

export function GfArabicCoverage() {
  return (
    <CoverageGroup title="GF Arabic"  warn>
      <CoverageGlyphs glyphSet={GFArabicCore} />
      <CoverageGlyphs glyphSet={GFArabicPlus} />
    </CoverageGroup>
  );
}

export function GfCyrillicCoverage() {
  return (
    <CoverageGroup title="GF Cyrillic"  warn>
      <CoverageGlyphs glyphSet={GFCyrillicCore} />
      <CoverageGlyphs glyphSet={GFCyrillicHistorical} />
      <CoverageGlyphs glyphSet={GFCyrillicPlus} />
      <CoverageGlyphs glyphSet={GFCyrillicPro} />
    </CoverageGroup>
  );
}

export function GfGreekCoverage() {
  return (
    <CoverageGroup title="GF Greek"  warn>
      <CoverageGlyphs glyphSet={GFGreekAncientMusicalSymbols} />
      <CoverageGlyphs glyphSet={GFGreekArchaic} />
      <CoverageGlyphs glyphSet={GFGreekCoptic} />
      <CoverageGlyphs glyphSet={GFGreekCore} />
      <CoverageGlyphs glyphSet={GFGreekExpert} />
      <CoverageGlyphs glyphSet={GFGreekPlus} />
      <CoverageGlyphs glyphSet={GFGreekPro} />
    </CoverageGroup>
  );
}

export function GfLatinCoverage() {
  return (
    <CoverageGroup title="GF Latin"  warn>
      <CoverageGlyphs glyphSet={GFLatinAfrican} />
      <CoverageGlyphs glyphSet={GFLatinBeyond} />
      <CoverageGlyphs glyphSet={GFLatinCore} />
      <CoverageGlyphs glyphSet={GFLatinKernel} />
      <CoverageGlyphs glyphSet={GFLatinPlus} />
      <CoverageGlyphs glyphSet={GFLatinPriAfrican} />
      <CoverageGlyphs glyphSet={GFLatinVietnamese} />
    </CoverageGroup>
  );
}

export function GfPhoneticsCoverage() {
  return (
    <CoverageGroup title="GF Phonetics"  warn>
      <CoverageGlyphs glyphSet={GFPhoneticsAPA} />
      <CoverageGlyphs glyphSet={GFPhoneticsDisorderedSpeech} />
      <CoverageGlyphs glyphSet={GFPhoneticsIPAHistorical} />
      <CoverageGlyphs glyphSet={GFPhoneticsIPAStandard} />
      <CoverageGlyphs glyphSet={GFPhoneticsSinoExt} />
    </CoverageGroup>
  );
}

export function GfTransLatinCoverage() {
  return (
    <CoverageGroup title="GF TransLatin"  warn>
      <CoverageGlyphs glyphSet={GFTransLatinArabic} />
      <CoverageGlyphs glyphSet={GFTransLatinPinyin} />
    </CoverageGroup>
  );
}
