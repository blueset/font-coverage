import { ChevronsDownUp, ChevronsUpDown, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CoverageGroup({
  title,
  children,
  warn,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  warn?: boolean;
}) {
  const [open, setOpen] = useState(!warn);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="[&:not(:has(.group>*))]:hidden space-y-4"
    >
      <h2 className="font-semibold text-2xl">
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="mr-2"
                aria-label={open ? "Collapse section" : "Expand section"}
              >
                {open ? <ChevronsDownUp /> : <ChevronsUpDown />}
              </Button>
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            {open ? "Collapse section" : "Expand section"}
          </TooltipContent>
        </Tooltip>
        <CollapsibleTrigger asChild>
          <span>{title}</span>
        </CollapsibleTrigger>
        {warn ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-2"
                aria-label="Warning: Glyph-based coverage may be incomplete or inaccurate"
              >
                <TriangleAlert className="text-amber-700 dark:text-amber-300" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Glyph-based coverage may be incomplete or inaccurate
            </TooltipContent>
          </Tooltip>
        ) : null}
      </h2>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "group gap-4 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </Collapsible>
  );
}
