import { Binoculars } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { VList } from "virtua";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

function PUABadge({ codepoints }: { codepoints: number[] }) {
  const isPua = codepoints.some(
    (cp) =>
      (cp >= 0xe000 && cp <= 0xf8ff) ||
      (cp >= 0xf0000 && cp <= 0xffffd) ||
      (cp >= 0x100000 && cp <= 0x10fffd)
  );
  if (!isPua) {
    return null;
  }
  return (
    <Badge variant="secondary" className="">
      Private Use Area
    </Badge>
  );
}

function MissingDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="View missing items"
            >
              <Binoculars />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="left">
          <p>View Missing Items</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

function GlyphsList({
  glyphs,
}: {
  glyphs: { codepoints: number[]; features?: string[] }[];
}) {
  return (
    <div
      className="max-h-[calc(100vh_-_8rem)] overflow-y-auto"
      style={{ height: `${42 * glyphs.length}px` }}
    >
      <VList>
        {glyphs.map((glyph, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-wrap items-center gap-2 py-2",
              index > 0 && "border-t border-border"
            )}
          >
            <span
              className="inline-block min-w-6 text-center"
              style={{
                fontFeatureSettings: glyph.features
                  ?.map((v) => `"${v}" 1`)
                  .join(", "),
              }}
            >
              {glyph.codepoints.map((cp) => String.fromCodePoint(cp)).join("")}
            </span>
            {glyph.codepoints.map((cp, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-sm font-mono"
              >
                U+{cp.toString(16).toUpperCase().padStart(4, "0")}
              </Badge>
            ))}
            {glyph.features?.map((variant, index) => (
              <Badge key={index} variant="secondary" className="font-mono">
                {variant}
              </Badge>
            ))}
            <PUABadge codepoints={glyph.codepoints} />
          </div>
        ))}
      </VList>
    </div>
  );
}

export function MissingGlyphs({
  missingGlyphs,
  includedGlyphs,
}: {
  missingGlyphs: { codepoints: number[]; features?: string[] }[];
  includedGlyphs?: { codepoints: number[]; features?: string[] }[];
}) {
  return (
    <MissingDialog>
      <Tabs
        defaultValue={
          missingGlyphs.length > (includedGlyphs?.length ?? 0)
            ? "included"
            : "missing"
        }
      >
        <DialogHeader>
          <TabsList>
            <TabsTrigger value="missing">
              {missingGlyphs.length} missing
            </TabsTrigger>
            <TabsTrigger value="included">
              {includedGlyphs?.length ?? 0} included
            </TabsTrigger>
          </TabsList>
        </DialogHeader>
        <TabsContent value="missing">
          <GlyphsList glyphs={missingGlyphs} />
        </TabsContent>
        <TabsContent value="included">
          <GlyphsList glyphs={includedGlyphs ?? []} />
        </TabsContent>
      </Tabs>
    </MissingDialog>
  );
}

function CodepointsList({ codepoints }: { codepoints: number[] }) {
  return (
    <div
      className="max-h-[calc(100vh_-_8rem)] overflow-y-auto"
      style={{ height: `${42 * codepoints.length}px` }}
    >
      <VList>
        {codepoints.map((codepoint, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-wrap items-center gap-2 py-2",
              index > 0 && "border-t border-border"
            )}
          >
            <span className="inline-block min-w-6 text-center">
              {String.fromCodePoint(codepoint)}
            </span>
            <Badge variant="outline" className="rounded-sm font-mono">
              U+{codepoint.toString(16).toUpperCase().padStart(4, "0")}
            </Badge>
            <PUABadge codepoints={[codepoint]} />
          </div>
        ))}
      </VList>
    </div>
  );
}

export function MissingCodepoints({
  missingCodepoints,
  includedCodepoints,
}: {
  missingCodepoints: number[];
  includedCodepoints?: number[];
}) {
  return (
    <MissingDialog>
      <Tabs
        defaultValue={
          missingCodepoints.length > (includedCodepoints?.length ?? 0)
            ? "included"
            : "missing"
        }
      >
        <DialogHeader>
          <TabsList>
            <TabsTrigger value="missing">
              {missingCodepoints.length} missing
            </TabsTrigger>
            <TabsTrigger value="included">
              {includedCodepoints?.length ?? 0} included
            </TabsTrigger>
          </TabsList>
        </DialogHeader>
        <TabsContent value="missing">
          <CodepointsList codepoints={missingCodepoints} />
        </TabsContent>
        <TabsContent value="included">
          <CodepointsList codepoints={includedCodepoints ?? []} />
        </TabsContent>
      </Tabs>
    </MissingDialog>
  );
}
