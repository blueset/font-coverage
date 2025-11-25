import type { Font } from "fontkit";

export interface GlyphInfo {
  codepoints: number[];
  variants?: string[];
}

export type GlyphToCodepoints = Map<number, number[]>;

export interface MarkAdjacency {
  from: Set<string>;
  to: Set<string>;
}

declare module "fontkit" {
  export class LazyArray<T> implements Array<T> {
    length: number;
    get(index: number): T;
  }

  interface Font {
    cmap: CMAP;
    GSUB: GSUB; // TODO
    GPOS: GPOS; // TODO
    _cmapProcessor: CmapProcessor;
    _layoutEngine: LayoutEngine;

    stream: {
      buffer: {
        buffer: ArrayBuffer;
      };
    };
  }

  export interface CMAP {
    version: number;
  }

  export interface CmapProcessor {
    codePointsForGlyph(glyphID: number): number[];
  }

  export interface GSUB {
    featureList: FeatureRecord[];
    lookupList: LazyArray<Lookup>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Lookup = any;

  export interface FeatureRecord {
    tag: string;
    feature: Feature;
  }

  export interface Feature {
    lookupListIndexes: number[];
  }

  export interface GPOS {
    featureList: FeatureRecord[];
    lookupList: LazyArray<Lookup>;
  }
}

export type { Font };
