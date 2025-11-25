import Big5Level1 from "@/data/nightFurySL2001/taiwan/big5_Level1.json" with { type: "json" };
import Big5Level2 from "@/data/nightFurySL2001/taiwan/big5_Level2.json" with { type: "json" };
import Big5Sym from "@/data/nightFurySL2001/taiwan/big5_Sym.json" with { type: "json" };
import Big5ETen from "@/data/nightFurySL2001/taiwan/big5_ETen.json" with { type: "json" };
import Big5GCCS from "@/data/nightFurySL2001/taiwan/big5_GCCS.json" with { type: "json" };
import Big5HKSCS1999 from "@/data/nightFurySL2001/taiwan/big5_HKSCS-1999.json" with { type: "json" };
import Big5HKSCS2001 from "@/data/nightFurySL2001/taiwan/big5_HKSCS-2001.json" with { type: "json" };
import Big5HKSCS2004 from "@/data/nightFurySL2001/taiwan/big5_HKSCS-2004.json" with { type: "json" };
import Big5HKSCS2008 from "@/data/nightFurySL2001/taiwan/big5_HKSCS-2008.json" with { type: "json" };
import Big5HKSCS2016 from "@/data/nightFurySL2001/taiwan/big5_HKSCS-2016.json" with { type: "json" };

import EduStandard1 from "@/data/nightFurySL2001/taiwan/standard/edu_standard_1.json" with { type: "json" };
import EduStandard2 from "@/data/nightFurySL2001/taiwan/standard/edu_standard_2.json" with { type: "json" };
import HanKeyu from "@/data/nightFurySL2001/taiwan/standard/han_keyu.json" with { type: "json" };
import HanTaiyu from "@/data/nightFurySL2001/taiwan/standard/han_taiyu.json" with { type: "json" };

import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function TaiwanBig5Coverage() {
  return (
    <CoverageGroup title="Taiwan Encodings">
      <CoverageEncoding name={Big5Level1.name} ranges={Big5Level1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5Level2.name} ranges={Big5Level2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5Sym.name} ranges={Big5Sym.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5ETen.name} ranges={Big5ETen.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5GCCS.name} ranges={Big5GCCS.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5HKSCS1999.name} ranges={Big5HKSCS1999.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5HKSCS2001.name} ranges={Big5HKSCS2001.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5HKSCS2004.name} ranges={Big5HKSCS2004.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5HKSCS2008.name} ranges={Big5HKSCS2008.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Big5HKSCS2016.name} ranges={Big5HKSCS2016.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function TaiwanStandardCoverage() {
  return (
    <CoverageGroup title="Taiwan Standards">
      <CoverageEncoding name={EduStandard1.name} ranges={EduStandard1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={EduStandard2.name} ranges={EduStandard2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={HanKeyu.name} ranges={HanKeyu.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={HanTaiyu.name} ranges={HanTaiyu.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}
