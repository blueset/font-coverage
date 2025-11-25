import "./App.css";
import { lazy, useTransition } from "react";
import { Loader2 } from "lucide-react";
import * as Font from "fontkit";
import { parseFont } from "./kit/parse";
import { FileDrop } from "./components/file-drop";
import { useFontStore } from "./store";
import { FontInfo } from "./components/font-info";
import { cn } from "./lib/utils";
import { ModeToggle } from "./components/mode-toggle";

// Lazy load all coverage components
const AdobeLatinCoverage = lazy(() =>
  import("./components/coverages/adobe").then((module) => ({
    default: module.AdobeLatinCoverage,
  }))
);
const AdobeGreekCoverage = lazy(() =>
  import("./components/coverages/adobe").then((module) => ({
    default: module.AdobeGreekCoverage,
  }))
);
const AdobeCyrillicCoverage = lazy(() =>
  import("./components/coverages/adobe").then((module) => ({
    default: module.AdobeCyrillicCoverage,
  }))
);
const AdobeArabicCoverage = lazy(() =>
  import("./components/coverages/adobe").then((module) => ({
    default: module.AdobeArabicCoverage,
  }))
);

const AdobeCmapCoverage = lazy(() =>
  import("./components/coverages/adobeCmap").then((module) => ({
    default: module.AdobeCmapCoverage,
  }))
);

const GfLatinCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfLatinCoverage,
  }))
);
const GfGreekCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfGreekCoverage,
  }))
);
const GfCyrillicCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfCyrillicCoverage,
  }))
);
const GfArabicCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfArabicCoverage,
  }))
);
const GfPhoneticsCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfPhoneticsCoverage,
  }))
);
const GfTransLatinCoverage = lazy(() =>
  import("./components/coverages/gf").then((module) => ({
    default: module.GfTransLatinCoverage,
  }))
);

const ChinaEncodingCoverage = lazy(() =>
  import("./components/coverages/china").then((module) => ({
    default: module.ChinaEncodingCoverage,
  }))
);
const ChinaFoundryCoverage = lazy(() =>
  import("./components/coverages/china").then((module) => ({
    default: module.ChinaFoundryCoverage,
  }))
);
const ChinaStandardCoverage = lazy(() =>
  import("./components/coverages/china").then((module) => ({
    default: module.ChinaStandardCoverage,
  }))
);

const JapanEncodingCoverage = lazy(() =>
  import("./components/coverages/japan").then((module) => ({
    default: module.JapanEncodingCoverage,
  }))
);
const JapanJISCoverage = lazy(() =>
  import("./components/coverages/japan").then((module) => ({
    default: module.JapanJISCoverage,
  }))
);
const JapanJoyoCoverage = lazy(() =>
  import("./components/coverages/japan").then((module) => ({
    default: module.JapanJoyoCoverage,
  }))
);
const JapanKankenCoverage = lazy(() =>
  import("./components/coverages/japan").then((module) => ({
    default: module.JapanKankenCoverage,
  }))
);
const JapanKyoikuCoverage = lazy(() =>
  import("./components/coverages/japan").then((module) => ({
    default: module.JapanKyoikuCoverage,
  }))
);

const TaiwanBig5Coverage = lazy(() =>
  import("./components/coverages/taiwan").then((module) => ({
    default: module.TaiwanBig5Coverage,
  }))
);
const TaiwanStandardCoverage = lazy(() =>
  import("./components/coverages/taiwan").then((module) => ({
    default: module.TaiwanStandardCoverage,
  }))
);

const HongkongCoverage = lazy(() =>
  import("./components/coverages/hongkong").then((module) => ({
    default: module.HongkongCoverage,
  }))
);

const KoreanEncodingCoverage = lazy(() =>
  import("./components/coverages/korean").then((module) => ({
    default: module.KoreanEncodingCoverage,
  }))
);

const UnicodeBlockCoverage = lazy(() =>
  import("./components/coverages/unicode").then((module) => ({
    default: module.UnicodeBlockCoverage,
  }))
);
const UnicodeScriptExtensionCoverage = lazy(() =>
  import("./components/coverages/unicode").then((module) => ({
    default: module.UnicodeScriptExtensionCoverage,
  }))
);

const JfCoverage = lazy(() =>
  import("./components/coverages/jf").then((module) => ({
    default: module.JfCoverage,
  }))
);

function App() {
  const { loadFont, setCollection } = useFontStore();
  const [isPending, startTransition] = useTransition();

  const handleChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCollection([]);
      const content = e.target?.result as ArrayBuffer | undefined;
      if (content) {
        // Wrap in requestAnimationFrame twice to ensure UI updates before heavy processing
        requestAnimationFrame(() => {
          startTransition(() => {
            requestAnimationFrame(() => {
              const font = Font.create({
                buffer: content,
                byteOffset: 0,
                byteLength: content.byteLength,
                slice: content.slice.bind(content),
              } as unknown as Buffer);
              if (
                font.type === "TTF" ||
                font.type === "WOFF" ||
                font.type === "WOFF2"
              ) {
                console.log("Loaded font:", font);
                const result = parseFont(font);
                loadFont(font, result.glyphs, result.markAdjacencies);
                const fontFace = new FontFace(
                  font.fullName,
                  `url(${URL.createObjectURL(file)})`
                );
                document.fonts.add(fontFace);
                fontFace.load();
              } else if (font.type === "TTC" || font.type === "DFont") {
                const font0 = font.fonts[0];
                setCollection(font.fonts);
                console.log("Loaded TTC fonts[0]:", font0);
                const result = parseFont(font0);
                loadFont(font0, result.glyphs, result.markAdjacencies);
                const fontFace = new FontFace(
                  font0.fullName,
                  `url(${URL.createObjectURL(file)})`
                );
                document.fonts.add(fontFace);
                fontFace.load();
              }
            });
          });
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFontChange = (fontName: string) => {
    const { collection } = useFontStore.getState();
    const selectedFont = collection?.find((f) => f.fullName === fontName);
    console.log("Switching to font:", selectedFont);
    if (selectedFont) {
      requestAnimationFrame(() => {
        startTransition(() => {
          requestAnimationFrame(() => {
            const result = parseFont(selectedFont);
            loadFont(selectedFont, result.glyphs, result.markAdjacencies);
            const fontFace = new FontFace(
              selectedFont.fullName,
              `url(${URL.createObjectURL(
                new Blob([selectedFont.stream.buffer.buffer])
              )})`
            );
            document.fonts.add(fontFace);
            fontFace.load();
          });
        });
      });
    }
  };

  return (
    <>
      <div className="space-y-4 mx-auto p-4 container">
        <nav className="flex justify-between items-center space-x-2 mb-4">
          <h1 className="font-bold text-2xl">Font Coverage Analyzer</h1>
          <ModeToggle />
        </nav>
        <FileDrop onFile={handleChange} />
        <FontInfo handleValueChange={handleFontChange} />
        {/* Encoding coverages */}
        <UnicodeBlockCoverage />
        <UnicodeScriptExtensionCoverage />
        <ChinaEncodingCoverage />
        <ChinaFoundryCoverage />
        <ChinaStandardCoverage />
        <JapanEncodingCoverage />
        <JapanJISCoverage />
        <JapanKyoikuCoverage />
        <JapanKankenCoverage />
        <JapanJoyoCoverage />
        <TaiwanBig5Coverage />
        <TaiwanStandardCoverage />
        <HongkongCoverage />
        <KoreanEncodingCoverage />
        {/* Glyph coverages */}
        <AdobeLatinCoverage />
        <AdobeGreekCoverage />
        <AdobeCyrillicCoverage />
        <AdobeArabicCoverage />
        <AdobeCmapCoverage />
        <GfLatinCoverage />
        <GfGreekCoverage />
        <GfCyrillicCoverage />
        <GfArabicCoverage />
        <GfPhoneticsCoverage />
        <GfTransLatinCoverage />
        <JfCoverage />
      </div>
      <div
        className={cn(
          "z-50 fixed inset-0 justify-center items-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isPending ? "flex opacity-100" : "hidden opacity-0"
        )}
      >
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    </>
  );
}

export default App;
