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

export function MissingGlyphs({
  missingGlyphs,
}: {
  missingGlyphs: { codepoints: number[]; features?: string[] }[];
}) {
  return (
    <MissingDialog>
      <DialogHeader>
        {missingGlyphs.length} glyph{missingGlyphs.length !== 1 ? "s" : ""}{" "}
        missing
      </DialogHeader>
      <div
        className="max-h-[calc(100vh_-_8rem)] overflow-y-auto"
        style={{ height: `${42 * missingGlyphs.length}px` }}
      >
        <VList>
          {missingGlyphs.map((glyph, index) => (
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
                {glyph.codepoints
                  .map((cp) => String.fromCodePoint(cp))
                  .join("")}
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
            </div>
          ))}
        </VList>
      </div>
    </MissingDialog>
  );
}

export function MissingCodepoints({
  missingCodepoints,
}: {
  missingCodepoints: number[];
}) {
  return (
    <MissingDialog>
      <DialogHeader>
        {missingCodepoints.length} codepoint
        {missingCodepoints.length !== 1 ? "s" : ""} missing
      </DialogHeader>
      <div
        className="max-h-[calc(100vh_-_8rem)] overflow-y-auto"
        style={{ height: `${42 * missingCodepoints.length}px` }}
      >
        <VList>
          {missingCodepoints.map((codepoint, index) => (
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
            </div>
          ))}
        </VList>
      </div>
    </MissingDialog>
  );
}
