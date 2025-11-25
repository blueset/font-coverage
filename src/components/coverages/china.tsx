import GBT2312 from "@/data/nightFurySL2001/china/encoding/gb_t_2312.json" with { type: "json" };
import GBT12345 from "@/data/nightFurySL2001/china/encoding/gb_t_12345.json" with { type: "json" };
import GBK from "@/data/nightFurySL2001/china/encoding/gbk.json" with { type: "json" };
import FangzhengJian from "@/data/nightFurySL2001/china/foundry/fangzheng_jian.json" with { type: "json" };
import FangzhengJianFan from "@/data/nightFurySL2001/china/foundry/fangzheng_jianfan.json" with { type: "json" };
import HanyiJianFan from "@/data/nightFurySL2001/china/foundry/hanyi_jianfan.json" with { type: "json" };
import Gujiyinshua from "@/data/nightFurySL2001/china/standard/gujiyinshua.json" with { type: "json" };
import TongyongGuifan1 from "@/data/nightFurySL2001/china/standard/tongyong_guifan_1.json" with { type: "json" };
import TongyongGuifan2 from "@/data/nightFurySL2001/china/standard/tongyong_guifan_2.json" with { type: "json" };
import TongyongGuifan3 from "@/data/nightFurySL2001/china/standard/tongyong_guifan_3.json" with { type: "json" };
import XiandaiChangyong1 from "@/data/nightFurySL2001/china/standard/xiandai_changyong_1.json" with { type: "json" };
import XiandaiChangyong2 from "@/data/nightFurySL2001/china/standard/xiandai_changyong_2.json" with { type: "json" };
import XiandaiTongyong1 from "@/data/nightFurySL2001/china/standard/xiandai_tongyong_1.json" with { type: "json" };
import XiandaiTongyong2 from "@/data/nightFurySL2001/china/standard/xiandai_tongyong_2.json" with { type: "json" };
import YiwuJiaoyu1 from "@/data/nightFurySL2001/china/standard/yiwu_jiaoyu_1.json" with { type: "json" };
import YiwuJiaoyu2 from "@/data/nightFurySL2001/china/standard/yiwu_jiaoyu_2.json" with { type: "json" };
import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function ChinaEncodingCoverage() {
  return (
    <CoverageGroup title="China Encodings">
      <CoverageEncoding name={GBT2312.name} ranges={GBT2312.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={GBT12345.name} ranges={GBT12345.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={GBK.name} ranges={GBK.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function ChinaFoundryCoverage() {
  return (
    <CoverageGroup title="China Foundries">
      <CoverageEncoding name={FangzhengJian.name} ranges={FangzhengJian.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={FangzhengJianFan.name} ranges={FangzhengJianFan.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={HanyiJianFan.name} ranges={HanyiJianFan.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function ChinaStandardCoverage() {
  return (
    <CoverageGroup title="China Standards">
      <CoverageEncoding name={TongyongGuifan1.name} ranges={TongyongGuifan1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={TongyongGuifan2.name} ranges={TongyongGuifan2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={TongyongGuifan3.name} ranges={TongyongGuifan3.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={YiwuJiaoyu1.name} ranges={YiwuJiaoyu1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={YiwuJiaoyu2.name} ranges={YiwuJiaoyu2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={XiandaiChangyong1.name} ranges={XiandaiChangyong1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={XiandaiChangyong2.name} ranges={XiandaiChangyong2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={XiandaiTongyong1.name} ranges={XiandaiTongyong1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={XiandaiTongyong2.name} ranges={XiandaiTongyong2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Gujiyinshua.name} ranges={Gujiyinshua.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}