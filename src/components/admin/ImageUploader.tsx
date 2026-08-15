import * as React from "react";
import { toast } from "sonner";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveImage } from "@/lib/assets";
import { BUNDLED_IMAGE_KEYS } from "@/lib/assets";
import {
  deleteCmsImageIfUnused,
  uploadCmsImage,
  validateImage,
  type UploadFolder,
} from "@/lib/uploads";

/** All image references currently stored in the CMS — used to avoid orphaned files. */
export const ImageRefsContext = React.createContext<string[]>([]);

function useUpload(folder: UploadFolder) {
  const [busy, setBusy] = React.useState(false);

  const run = React.useCallback(
    async (file: File): Promise<string | null> => {
      const problem = validateImage(file);
      if (problem) {
        toast.error(problem);
        return null;
      }
      setBusy(true);
      const id = toast.loading(`Uploading ${file.name}…`);
      try {
        const url = await uploadCmsImage(file, folder);
        toast.success("Image uploaded", { id });
        return url;
      } catch (e: any) {
        toast.error(e?.message ?? "Upload failed", { id });
        return null;
      } finally {
        setBusy(false);
      }
    },
    [folder],
  );

  return { busy, run };
}

function Preview({ value }: { value: string }) {
  if (!value) {
    return (
      <div className="flex size-20 items-center justify-center border border-hairline text-muted-foreground">
        <ImageIcon className="size-4" />
      </div>
    );
  }
  return (
    <img
      src={resolveImage(value)}
      alt=""
      className="size-20 border border-hairline object-cover"
      loading="lazy"
    />
  );
}

function BundledPicker({ onPick }: { onPick: (key: string) => void }) {
  return (
    <details className="text-xs">
      <summary className="cursor-pointer text-muted-foreground">Use a bundled image</summary>
      <div className="mt-2 flex flex-wrap gap-1">
        {BUNDLED_IMAGE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onPick(key)}
            className="cursor-pointer border border-hairline px-2 py-1 text-[0.625rem] text-muted-foreground hover:border-foreground hover:text-foreground"
          >
            {key}
          </button>
        ))}
      </div>
    </details>
  );
}

/* -------------------------------------------------- single image */

export function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (value: string) => void;
  folder: UploadFolder;
}) {
  const refs = React.useContext(ImageRefsContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { busy, run } = useUpload(folder);

  async function handleFile(file: File) {
    const url = await run(file);
    if (!url) return;
    const previous = value;
    onChange(url);
    await deleteCmsImageIfUnused(previous, refs);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Preview value={value} />
        <div className="flex-1 space-y-2">
          <Input
            value={value ?? ""}
            placeholder="Image URL or bundled file name"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {value ? "Replace" : "Upload"}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={async () => {
                  const previous = value;
                  onChange("");
                  await deleteCmsImageIfUnused(previous, refs);
                }}
              >
                <X className="size-4" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <BundledPicker onPick={onChange} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}

/* -------------------------------------------------- multiple images */

export function ImageListField({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  folder: UploadFolder;
}) {
  const refs = React.useContext(ImageRefsContext);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { busy, run } = useUpload(folder);
  const list = Array.isArray(value) ? value : [];

  async function handleFiles(files: File[]) {
    const uploaded: string[] = [];
    for (const file of files) {
      const url = await run(file);
      if (url) uploaded.push(url);
    }
    if (uploaded.length) onChange([...list, ...uploaded]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {list.map((img, i) => (
          <div key={`${img}-${i}`} className="relative">
            <Preview value={img} />
            <button
              type="button"
              aria-label="Remove image"
              className="absolute -end-2 -top-2 cursor-pointer border border-hairline bg-background p-1"
              onClick={async () => {
                onChange(list.filter((_, idx) => idx !== i));
                await deleteCmsImageIfUnused(img, refs);
              }}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload images
        </Button>
      </div>

      <Input
        placeholder="Add an image URL and press Enter"
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const v = (e.target as HTMLInputElement).value.trim();
          if (!v) return;
          onChange([...list, v]);
          (e.target as HTMLInputElement).value = "";
        }}
      />

      <BundledPicker onPick={(key) => onChange([...list, key])} />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void handleFiles(files);
        }}
      />
    </div>
  );
}
