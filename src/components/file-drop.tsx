import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileSource = "picker" | "drop" | "paste";

export interface FileDropMeta {
  source: FileSource;
  files: File[];
  originalEvent:
    | DragEvent
    | ClipboardEvent
    | React.ChangeEvent<HTMLInputElement>;
}

export interface FileDropProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<
      React.InputHTMLAttributes<HTMLInputElement>,
      "accept" | "multiple" | "disabled"
    > {
  onFile: (file: File, meta: FileDropMeta) => void;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  supportTypeText?: React.ReactNode;
}

const hasFilePayload = (event: DragEvent) => {
  const types = event.dataTransfer?.types ?? [];
  return Array.from(types).includes("Files");
};

const filesFromList = (list?: FileList | null) =>
  list ? Array.from(list) : [];

export function FileDrop({
  onFile,
  accept,
  multiple,
  disabled,
  label = "Select a file",
  helperText = "Drag & drop anywhere, paste from clipboard, or browse manually.",
  supportTypeText = "Supports click, drag-and-drop, or clipboard paste",
  className,
  children,
  ...rest
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDraggingViewport, setIsDraggingViewport] = useState(false);

  const emitFiles = useCallback(
    (
      files: File[],
      source: FileSource,
      originalEvent:
        | DragEvent
        | ClipboardEvent
        | React.ChangeEvent<HTMLInputElement>
    ) => {
      if (!files.length) return;
      files.forEach((file) => onFile(file, { source, files, originalEvent }));
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      if (disabled) return;
      if (!hasFilePayload(event)) return;
      event.preventDefault();
      setIsDraggingViewport(false);
      dragDepth.current = 0;
      const files = filesFromList(event.dataTransfer?.files);
      emitFiles(files, "drop", event);
    },
    [disabled, emitFiles]
  );

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      if (disabled) return;
      if (!hasFilePayload(event)) return;
      event.preventDefault();
      dragDepth.current += 1;
      setIsDraggingViewport(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      if (disabled) return;
      if (!hasFilePayload(event)) return;
      event.preventDefault();
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) {
        setIsDraggingViewport(false);
      }
    },
    [disabled]
  );

  // Listen globally so drags anywhere in the viewport are captured.
  useEffect(() => {
    if (disabled) return;

    const handleDragOver = (event: DragEvent) => {
      if (!hasFilePayload(event)) return;
      event.preventDefault();
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      dragDepth.current = 0;
      setIsDraggingViewport(false);
    };
  }, [disabled, handleDragEnter, handleDragLeave, handleDrop]);

  const handlePaste = useCallback(
    (event: ClipboardEvent) => {
      if (disabled) return;
      const files = filesFromList(event.clipboardData?.files);
      if (!files.length) return;
      event.preventDefault();
      emitFiles(files, "paste", event);
    },
    [disabled, emitFiles]
  );

  useEffect(() => {
    if (disabled) return;
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [disabled, handlePaste]);

  const handlePickerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const files = filesFromList(event.target.files);
      emitFiles(files, "picker", event);
      event.target.value = "";
    },
    [disabled, emitFiles]
  );

  const openFileDialog = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handlePickerChange}
        title="Hidden file picker trigger"
        tabIndex={-1}
      />

      <div
        data-component="file-drop"
        className={cn(
          "bg-background/60 p-6 border border-muted-foreground/40 border-dashed rounded-xl text-center",
          disabled && "opacity-60",
          className
        )}
        {...rest}
      >
        {children ?? (
          <div className="flex flex-col items-center gap-3">
            <Button type="button" onClick={openFileDialog} disabled={disabled}>
              {label}
            </Button>
            <p className="text-muted-foreground text-sm">{helperText}</p>
            <p className="text-muted-foreground/80 text-xs">
              {supportTypeText}
            </p>
          </div>
        )}
      </div>

      {isDraggingViewport && !disabled && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-background/90 pointer-events-none">
          {/* Provide a clear visual cue while files hover over the window. */}
          <div className="bg-background/80 shadow-xl px-10 py-8 border-4 border-primary/70 border-dashed rounded-2xl text-center">
            <p className="font-semibold text-primary text-base">
              Drop your file to upload
            </p>
            <p className="text-muted-foreground text-sm">
              Release anywhere in the window
            </p>
          </div>
        </div>
      )}
    </>
  );
}
