import UnicodeBlocks from "@/data/unicode/blocks.json" with { type: "json" };
import UnicodeScriptExtensions from "@/data/unicode/scriptExtensions.json" with { type: "json" };

import { CoverageEncoding, type CoverageRange } from "../coverage-encoding";
import { CoverageGroup } from "../coverage-group";

export function UnicodeBlockCoverage() {
  return (
    <CoverageGroup title="Unicode Blocks">
      {UnicodeBlocks.map((block) => (
        <CoverageEncoding
          key={block.name}
          name={block.name}
          ranges={block.ranges as CoverageRange[]}
        />
      ))}
    </CoverageGroup>
  );
}

export function UnicodeScriptExtensionCoverage() {
  return (
    <CoverageGroup title="Unicode Script Extensions">
      {UnicodeScriptExtensions.map((script) => (
        <CoverageEncoding
          key={script.name}
          name={script.name}
          ranges={script.ranges as CoverageRange[]}
        />
      ))}
    </CoverageGroup>
  );
}