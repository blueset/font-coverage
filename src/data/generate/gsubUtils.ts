import type { GlyphClassDefinition, GlyphExpression } from "./gsubFea";

export function expandGlyphClassDefinition(
  statement: GlyphClassDefinition,
  classes: Record<string, string[]>
) {
  const glyphs: string[] = [];

  const collect = (expr: GlyphExpression) => {
    if (expr.kind === "glyph") {
      glyphs.push(expr.value);
      return;
    }
    if (expr.kind === "group") {
      expr.items.forEach(collect);
      return;
    }
    if (expr.kind === "class") {
      const referenced = classes[expr.name];
      if (!referenced) {
        return;
      }
      glyphs.push(...referenced);
    }
  };

  statement.members.forEach(collect);
  classes[statement.name] = glyphs;
}

export function iterateInputs(
  inputs: GlyphExpression[],
  classes: Record<string, string[]>
): string[][] {
  const expandExpr = (expr: GlyphExpression): string[] => {
    if (expr.kind === "glyph") {
      return [expr.value];
    }
    if (expr.kind === "class") {
      return classes[expr.name] ?? [];
    }
    if (expr.kind === "group") {
      return expr.items.flatMap((item) => expandExpr(item));
    }
    return [];
  };

  return inputs.reduce<string[][]>(
    (acc, expr) => {
      const choices = expandExpr(expr);
      if (!choices.length) {
        return acc;
      }
      const next: string[][] = [];
      for (const prefix of acc) {
        for (const glyph of choices) {
          next.push([...prefix, glyph]);
        }
      }
      return next;
    },
    [[]]
  );
}

export function cidsToCodepoints(
  cids: string[],
  cidToCodepointsMapping: Map<number, number[][]>
): number[][] {
  const codepointsIterables: number[][][] = [];
  for (const cidStr of cids) {
    if (!cidStr.match(/^\\\d+$/)) {
      console.warn(`Unknown CID format: ${cidStr}`);
      continue;
    }
    const cid = parseInt(cidStr.replace("\\", ""), 10);
    const mappings = cidToCodepointsMapping.get(cid);
    if (mappings) {
      codepointsIterables.push(mappings);
    } else {
      console.warn(`No mapping for CID ${cid}`);
    }
  }
  const codepoints: number[][] = codepointsIterables.reduce<number[][]>(
    (acc, group) => {
      if (!group.length) {
        return acc;
      }
      const next: number[][] = [];
      for (const prefix of acc) {
        for (const choice of group) {
          next.push([...prefix, ...choice]);
        }
      }
      return next;
    },
    [[]]
  );

  return codepoints;
}
