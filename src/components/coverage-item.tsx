import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "./ui/progress";
import { MissingCodepoints, MissingGlyphs } from "./missing-dialog";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";

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
    <Item variant="outline" className="p-3">
      <ItemActions>
        <div
          className={cn(
            "bg-muted rounded-full size-10",
            coverage === total && "bg-green-700 dark:bg-green-300"
          )}
        >
          {coverage === total ? (
            <Check className="m-2.5 size-5 text-green-200 dark:text-green-900" />
          ) : (
            <div
              className="rounded-full size-full"
              style={{
                backgroundImage: `conic-gradient(var(--foreground) 0% ${
                  (coverage / total) * 100
                }%, var(--muted) ${(coverage / total) * 100}% 100%)`,
              }}
            >
              <div className="place-content-center size-full font-medium text-white text-center mix-blend-difference">
                {Math.max(1, Math.min((coverage / total) * 100, 99)).toFixed(0)}
                <small>%</small>
              </div>
            </div>
          )}
        </div>
      </ItemActions>
      <ItemContent>
        <ItemTitle className="flex justify-stretch items-center gap-y-0 w-full min-h-8">
          <span className="grow">{name}</span>
          <ItemDescription className="shrink-0">
            <span>
              {coverage} / {total}
            </span>
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
