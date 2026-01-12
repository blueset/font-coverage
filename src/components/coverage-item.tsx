import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { MissingCodepoints, MissingGlyphs } from "./missing-dialog";
import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

export function CoverageItem({
  name,
  coverage,
  total,
  missingGlyphs,
  missingCodepoints,
  includedGlyphs,
  includedCodepoints,
}: {
  name: string;
  coverage: number;
  total: number;
  missingGlyphs?: { codepoints: number[]; features?: string[] }[];
  missingCodepoints?: number[];
  includedGlyphs?: { codepoints: number[]; features?: string[] }[];
  includedCodepoints?: number[];
}) {
  const item = (
    <Item variant="outline" className="relative p-3 overflow-clip">
      <div
        className="absolute inset-0 bg-linear-to-r from-transparent to-green-700/10 dark:to-green-300/10 border-r border-r-green-700/40 dark:border-r-green-300/40"
        style={{
          translate: `${-(1 - coverage / total) * 100}% 0`,
        }}
      ></div>
      <ItemContent>
        <ItemTitle className="flex justify-stretch items-center gap-y-0 w-full min-h-8">
          <span className={cn("grow")}>
            {coverage === total && (
              <CircleCheckBig className="inline mr-1.5 size-4 text-green-600 dark:text-green-300 -translate-y-0.25" />
            )}
            {name}
          </span>
          <ItemDescription className="flex flex-col items-end shrink-0">
            <div
              style={
                {
                  "--percentage": `${(coverage / total) * 100}%`,
                } as React.CSSProperties
              }
              className="font-medium text-[color-mix(in_srgb,var(--color-green-600)_var(--percentage),var(--color-muted-foreground))] dark:text-[color-mix(in_srgb,var(--color-green-300)_var(--percentage),var(--color-muted-foreground))]"
            >
              {Math.floor((coverage / total) * 100).toFixed(0)}%
            </div>
            <small>
              {coverage} / {total}
            </small>
          </ItemDescription>
        </ItemTitle>
      </ItemContent>
    </Item>
  );

  if (missingGlyphs?.length || includedGlyphs?.length) {
    return (
      <MissingGlyphs
        missingGlyphs={missingGlyphs ?? []}
        includedGlyphs={includedGlyphs}
      >
        {item}
      </MissingGlyphs>
    );
  } else if (missingCodepoints?.length || includedCodepoints?.length) {
    return (
      <MissingCodepoints
        missingCodepoints={missingCodepoints ?? []}
        includedCodepoints={includedCodepoints}
      >
        {item}
      </MissingCodepoints>
    );
  } else {
    return item;
  }
}
