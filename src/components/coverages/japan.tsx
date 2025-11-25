import JIS0208 from "@/data/nightFurySL2001/japan/ref/JIS0208.json" with { type: "json" };
import JIS0212 from "@/data/nightFurySL2001/japan/ref/JIS0212.json" with { type: "json" };
import JISX0213 from "@/data/nightFurySL2001/japan/ref/jisx0213-2004-std.json" with { type: "json" };
import ShiftJIS from "@/data/nightFurySL2001/japan/ref/SHIFTJIS.json" with { type: "json" };

import JISLv1 from "@/data/nightFurySL2001/japan/jis-lv1.json" with { type: "json" };
import JISLv2 from "@/data/nightFurySL2001/japan/jis-lv2.json" with { type: "json" };
import JISLv3 from "@/data/nightFurySL2001/japan/jis-lv3.json" with { type: "json" };
import JISLv4 from "@/data/nightFurySL2001/japan/jis-lv4.json" with { type: "json" };

import Kyoiku1 from "@/data/nightFurySL2001/japan/kyoiku_1.json" with { type: "json" };
import Kyoiku2 from "@/data/nightFurySL2001/japan/kyoiku_2.json" with { type: "json" };
import Kyoiku3 from "@/data/nightFurySL2001/japan/kyoiku_3.json" with { type: "json" };
import Kyoiku4 from "@/data/nightFurySL2001/japan/kyoiku_4.json" with { type: "json" };
import Kyoiku5 from "@/data/nightFurySL2001/japan/kyoiku_5.json" with { type: "json" };
import Kyoiku6 from "@/data/nightFurySL2001/japan/kyoiku_6.json" with { type: "json" };

import Kanken10 from "@/data/nightFurySL2001/japan/kanken_LV10.json" with { type: "json" };
import Kanken9 from "@/data/nightFurySL2001/japan/kanken_LV9.json" with { type: "json" };
import Kanken8 from "@/data/nightFurySL2001/japan/kanken_LV8.json" with { type: "json" };
import Kanken7 from "@/data/nightFurySL2001/japan/kanken_LV7.json" with { type: "json" };
import Kanken6 from "@/data/nightFurySL2001/japan/kanken_LV6.json" with { type: "json" };
import Kanken5 from "@/data/nightFurySL2001/japan/kanken_LV5.json" with { type: "json" };
import Kanken4 from "@/data/nightFurySL2001/japan/kanken_LV4.json" with { type: "json" };
import Kanken3 from "@/data/nightFurySL2001/japan/kanken_LV3.json" with { type: "json" };
import Kanken2J from "@/data/nightFurySL2001/japan/kanken_LV2J.json" with { type: "json" };
import Kanken2 from "@/data/nightFurySL2001/japan/kanken_LV2.json" with { type: "json" };
import Kanken1J from "@/data/nightFurySL2001/japan/kanken_LV1J.json" with { type: "json" };
import Kanken1 from "@/data/nightFurySL2001/japan/kanken_LV1.json" with { type: "json" };

import JoyoKanji from "@/data/nightFurySL2001/japan/joyokanji.json" with { type: "json" };
import Jinmeiyo from "@/data/nightFurySL2001/japan/jinmeiyo.json" with { type: "json" };

import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function JapanEncodingCoverage() {
  return (
    <CoverageGroup title="Japan Encodings">
      <CoverageEncoding name={JIS0208.name} ranges={JIS0208.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={JIS0212.name} ranges={JIS0212.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={JISX0213.name} ranges={JISX0213.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={ShiftJIS.name} ranges={ShiftJIS.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function JapanJISCoverage() {
  return (
    <CoverageGroup title="Japan JIS">
      <CoverageEncoding name={JISLv1.name} ranges={JISLv1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={JISLv2.name} ranges={JISLv2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={JISLv3.name} ranges={JISLv3.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={JISLv4.name} ranges={JISLv4.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function JapanKyoikuCoverage() {
  return (
    <CoverageGroup title="Japan Kyoiku Kanji">
      <CoverageEncoding name={Kyoiku1.name} ranges={Kyoiku1.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kyoiku2.name} ranges={Kyoiku2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kyoiku3.name} ranges={Kyoiku3.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kyoiku4.name} ranges={Kyoiku4.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kyoiku5.name} ranges={Kyoiku5.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kyoiku6.name} ranges={Kyoiku6.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function JapanKankenCoverage() {
  return (
    <CoverageGroup title="Japan Kanken">
      <CoverageEncoding name={Kanken10.name} ranges={Kanken10.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken9.name} ranges={Kanken9.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken8.name} ranges={Kanken8.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken7.name} ranges={Kanken7.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken6.name} ranges={Kanken6.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken5.name} ranges={Kanken5.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken4.name} ranges={Kanken4.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken3.name} ranges={Kanken3.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken2J.name} ranges={Kanken2J.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken2.name} ranges={Kanken2.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken1J.name} ranges={Kanken1J.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Kanken1.name} ranges={Kanken1.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}

export function JapanJoyoCoverage() {
  return (
    <CoverageGroup title="Japan Joyo Kanji">
      <CoverageEncoding name={JoyoKanji.name} ranges={JoyoKanji.codepointRanges as CoverageRange[]} />
      <CoverageEncoding name={Jinmeiyo.name} ranges={Jinmeiyo.codepointRanges as CoverageRange[]} />
    </CoverageGroup>
  );
}
