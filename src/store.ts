import { create } from "zustand";
import type { GlyphInfo, MarkAdjacency } from "./kit/type";
import type * as Font from "fontkit";

type Store = {
  name?: string;
  font?: Font.Font;
  glyphs?: GlyphInfo[];
  glyphsSet?: Set<string>;
  markAdjacencies?: MarkAdjacency[];
  loadFont: (
    font: Font.Font,
    glyphs: GlyphInfo[],
    markAdjacencies: MarkAdjacency[]
  ) => void;
  collection?: Font.Font[];
  setCollection: (collection: Font.Font[]) => void;
};

export const useFontStore = create<Store>((set) => ({
  setCollection: (collection: Font.Font[]) => set(() => ({ collection })),
  loadFont: (font, glyphs, markAdjacencies) =>
    set(() => ({
      name: font.fullName,
      font,
      glyphs,
      glyphsSet: new Set(
        glyphs.map((g) => {
          let key = g.codepoints.join(",");
          if (g.variants) {
            key += "-" + [...g.variants].sort().join(",");
          }
          return key;
        })
      ),
      markAdjacencies,
    })),
}));
