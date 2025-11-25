import { useFontStore } from "@/store";
import { OptionalLink } from "./optional-link";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

export interface FontInfoProps {
  handleValueChange?: (value: string) => void;
}

export function FontInfo({ handleValueChange }: FontInfoProps) {
  const { font, name, collection } = useFontStore();

  if (!name) {
    return null;
  }

  return (
    <div className="p-4 border-border border-b">
      {collection?.length ? (
        <Select value={name} onValueChange={handleValueChange}>
          <SelectTrigger className="mx-auto mb-4 data-[size=default]:h-auto">
            <h1
              className="text-3xl text-center"
              style={{
                fontFamily: `"${name}", sans-serif`,
              }}
            >
              {name} (+{collection.length - 1})
            </h1>
          </SelectTrigger>
          <SelectContent>
            {collection.map((f, index) => (
              <SelectItem key={index} value={f.fullName}>
                {f.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <h1
          className="mb-4 text-3xl text-center"
          style={{
            fontFamily: `"${name}", sans-serif`,
          }}
        >
          {name}
        </h1>
      )}
      <div className="items-baseline gap-x-6 gap-y-2 grid grid-cols-[max-content_1fr] mx-auto mb-4 max-w-240">
        {font?.type && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Type
            </span>
            {font?.type}
          </>
        )}
        {font?.numGlyphs && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Number of glyphs
            </span>
            {font?.numGlyphs}
          </>
        )}
        {font?.version && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Version
            </span>
            {font?.version}
          </>
        )}
        {font?.copyright && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Copyright
            </span>
            {font?.copyright}
          </>
        )}
        {font?.getName("description", "") && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Description
            </span>
            {font?.getName("description", "")}
          </>
        )}
        {font?.getName("designer", "") && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Designer
            </span>
            <OptionalLink
              href={font?.getName("designerURL", "") ?? undefined}
              className="[&[href]]:underline"
            >
              {font?.getName("designer", "")}
            </OptionalLink>
          </>
        )}
        {font?.getName("manufacturer", "") && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Manufacturer
            </span>
            <OptionalLink
              href={font?.getName("manufacturerURL", "") ?? undefined}
              className="[&[href]]:underline"
            >
              {font?.getName("manufacturer", "")}
            </OptionalLink>
          </>
        )}
        {font?.getName("license", "") && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              License
            </span>
            <OptionalLink
              href={font?.getName("licenseURL", "") ?? undefined}
              className="[&[href]]:underline"
            >
              {font?.getName("license", "")}
            </OptionalLink>
          </>
        )}
        {font?.getName("trademark", "") && (
          <>
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              Trademark
            </span>
            {font?.getName("trademark", "")}
          </>
        )}
      </div>
    </div>
  );
}
