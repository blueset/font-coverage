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
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle className="flex flex-wrap gap-y-0 w-full min-h-8">
          {name}
          <ItemDescription className="inline-flex justify-between gap-4 grow">
            <span>
              {coverage} / {total}
            </span>
            <span>{((coverage / total) * 100).toFixed(0)}%</span>
          </ItemDescription>
        </ItemTitle>
      </ItemContent>
      {missingGlyphs?.length ? (
        <ItemActions>
          <MissingGlyphs
            missingGlyphs={missingGlyphs}
            includedGlyphs={includedGlyphs}
          />
        </ItemActions>
      ) : null}
      {missingCodepoints?.length ? (
        <ItemActions>
          <MissingCodepoints
            missingCodepoints={missingCodepoints}
            includedCodepoints={includedCodepoints}
          />
        </ItemActions>
      ) : null}
      <ItemFooter>
        <Progress
          value={(coverage / total) * 100}
          className={cn(
            "w-full",
            coverage === total &&
              "**:data-[slot='progress-indicator']:bg-green-700 dark:**:data-[slot='progress-indicator']:bg-green-300"
          )}
        />
      </ItemFooter>
    </Item>
  );
}
