import HKChangyong from "@/data/nightFurySL2001/hong_kong/hk-changyong.json" with { type: "json" };
import HKXizibiao from "@/data/nightFurySL2001/hong_kong/hk-xizibiao.json" with { type: "json" };
import HKSCS from "@/data/nightFurySL2001/hong_kong/hkscs.json" with { type: "json" };
import SuppChara1 from "@/data/nightFurySL2001/hong_kong/suppchara_1.json" with { type: "json" };
import SuppChara2 from "@/data/nightFurySL2001/hong_kong/suppchara_2.json" with { type: "json" };
import SuppChara3 from "@/data/nightFurySL2001/hong_kong/suppchara_3.json" with { type: "json" };
import SuppChara4 from "@/data/nightFurySL2001/hong_kong/suppchara_4.json" with { type: "json" };
import SuppChara5 from "@/data/nightFurySL2001/hong_kong/suppchara_5.json" with { type: "json" };
import SuppChara6 from "@/data/nightFurySL2001/hong_kong/suppchara_6.json" with { type: "json" };

import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function HongkongCoverage() {
  return (
    <CoverageGroup title="Hong Kong">
      <CoverageEncoding name={HKChangyong.name} ranges={HKChangyong.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={HKXizibiao.name} ranges={HKXizibiao.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={HKSCS.name} ranges={HKSCS.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara1.name} ranges={SuppChara1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara2.name} ranges={SuppChara2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara3.name} ranges={SuppChara3.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara4.name} ranges={SuppChara4.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara5.name} ranges={SuppChara5.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={SuppChara6.name} ranges={SuppChara6.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}
