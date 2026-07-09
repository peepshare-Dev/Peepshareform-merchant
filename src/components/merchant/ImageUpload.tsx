import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileToUploadedFile, type UploadedFile } from "@/lib/merchant-form";

interface SingleImageUploadProps {
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  invalid?: boolean;
  id?: string;
}

export function SingleImageUpload({ value, onChange, invalid, id }: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setLoading(true);
    try {
      onChange(await fileToUploadedFile(files[0]));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-3">
          <img
            src={value.data}
            alt="ตัวอย่างโลโก้"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{value.name}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-1 text-xs font-medium text-brand hover:underline"
            >
              เปลี่ยนรูป
            </button>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            aria-label="ลบรูป"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:border-brand hover:bg-brand-soft/40",
            invalid && "border-destructive/60",
          )}
        >
          {loading ? (
            <Loader2 className="size-6 animate-spin text-brand" />
          ) : (
            <ImagePlus className="size-6 text-brand" />
          )}
          <span className="text-sm font-medium text-foreground">คลิกเพื่ออัปโหลดโลโก้</span>
          <span className="text-xs text-muted-foreground">PNG, JPG (สูงสุด ~5MB)</span>
        </button>
      )}
    </div>
  );
}

interface MultiImageUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  id?: string;
}

export function MultiImageUpload({ value, onChange, id }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    try {
      const converted = await Promise.all(Array.from(files).map(fileToUploadedFile));
      onChange([...value, ...converted]);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((file, i) => (
          <div key={`${file.name}-${i}`} className="group relative aspect-square">
            <img
              src={file.data}
              alt={file.name}
              className="h-full w-full rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background opacity-90 transition-opacity"
              aria-label="ลบรูป"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-brand hover:text-brand"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Upload className="size-5" />
          )}
          <span className="text-[11px]">เพิ่มรูป</span>
        </button>
      </div>
    </div>
  );
}
