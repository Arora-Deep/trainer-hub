import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code,
  AlignLeft, AlignCenter, AlignRight, Link2, Unlink, Undo2, Redo2,
  Highlighter, Eraser, Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
};

const FONT_FAMILIES = [
  { label: "Sans", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
];

const FONT_SIZES = [
  { label: "XS", value: "1" },
  { label: "S", value: "2" },
  { label: "Normal", value: "3" },
  { label: "L", value: "4" },
  { label: "XL", value: "5" },
  { label: "2XL", value: "6" },
  { label: "3XL", value: "7" },
];

const COLORS = ["#0F172A", "#475569", "#94A3B8", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
const HIGHLIGHTS = ["transparent", "#FEF3C7", "#DCFCE7", "#DBEAFE", "#FCE7F3", "#FEE2E2"];

export function RichTextEditor({ value = "", onChange, placeholder, className, minHeight = 320 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);
  const lastValueRef = useRef<string>("");

  useEffect(() => {
    if (!ref.current) return;
    if (value !== lastValueRef.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
      lastValueRef.current = value || "";
    }
  }, [value]);

  const exec = useCallback((cmd: string, val?: string) => {
    ref.current?.focus();
    try { document.execCommand(cmd, false, val); } catch {}
    const html = ref.current?.innerHTML ?? "";
    lastValueRef.current = html;
    onChange?.(html);
    setTick((t) => t + 1);
  }, [onChange]);

  const handleInput = () => {
    const html = ref.current?.innerHTML ?? "";
    lastValueRef.current = html;
    onChange?.(html);
  };

  const setBlock = (tag: string) => exec("formatBlock", tag);
  const insertLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (url) exec("createLink", url);
  };
  const insertImage = () => {
    const url = window.prompt("Image URL", "https://");
    if (url) exec("insertImage", url);
  };

  return (
    <div className={cn("rounded-md border bg-background overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1 sticky top-0 z-10">
        <ToolGroup>
          <ToolBtn onClick={() => exec("undo")} title="Undo"><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("redo")} title="Redo"><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <select
            className="h-7 rounded border bg-background px-1.5 text-xs"
            defaultValue=""
            onChange={(e) => { setBlock(e.target.value); e.currentTarget.selectedIndex = 0; }}
            title="Paragraph style"
          >
            <option value="" disabled>Style</option>
            <option value="P">Paragraph</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="H4">Heading 4</option>
            <option value="BLOCKQUOTE">Quote</option>
            <option value="PRE">Code block</option>
          </select>
          <select
            className="h-7 rounded border bg-background px-1.5 text-xs max-w-[110px]"
            defaultValue=""
            onChange={(e) => { exec("fontName", e.target.value); e.currentTarget.selectedIndex = 0; }}
            title="Font family"
          >
            <option value="" disabled>Font</option>
            {FONT_FAMILIES.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
          </select>
          <select
            className="h-7 rounded border bg-background px-1.5 text-xs"
            defaultValue="3"
            onChange={(e) => exec("fontSize", e.target.value)}
            title="Font size"
          >
            {FONT_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={() => exec("bold")} title="Bold"><Bold className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("italic")} title="Italic"><Italic className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("underline")} title="Underline"><Underline className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("strikeThrough")} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <ColorPicker label={<span className="text-xs font-semibold">A</span>} colors={COLORS} onPick={(c) => exec("foreColor", c)} title="Text color" />
          <ColorPicker label={<Highlighter className="h-3.5 w-3.5" />} colors={HIGHLIGHTS} onPick={(c) => exec("hiliteColor", c)} title="Highlight" />
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={() => setBlock("H1")} title="H1"><Heading1 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => setBlock("H2")} title="H2"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => setBlock("H3")} title="H3"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bullet list"><List className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("insertOrderedList")} title="Numbered list"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => setBlock("BLOCKQUOTE")} title="Quote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => setBlock("PRE")} title="Code block"><Code className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={() => exec("justifyLeft")} title="Align left"><AlignLeft className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("justifyCenter")} title="Align center"><AlignCenter className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("justifyRight")} title="Align right"><AlignRight className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>

        <ToolGroup>
          <ToolBtn onClick={insertLink} title="Insert link"><Link2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("unlink")} title="Remove link"><Unlink className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={insertImage} title="Insert image"><ImageIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => exec("removeFormat")} title="Clear formatting"><Eraser className="h-3.5 w-3.5" /></ToolBtn>
        </ToolGroup>
      </div>

      {/* Editor surface */}
      <div
        ref={ref}
        className={cn(
          "rte-content prose prose-sm max-w-none px-4 py-3 focus:outline-none",
          "prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
          "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-blockquote:border-l-primary",
          "prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:text-foreground prose-pre:p-3 prose-pre:rounded-md",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground",
        )}
        style={{ minHeight }}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder ?? "Start writing your lesson…"}
        onInput={handleInput}
        onBlur={handleInput}
      />
    </div>
  );
}

function ToolGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5 px-1 border-r last:border-r-0">{children}</div>;
}

function ToolBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-foreground/80"
    >
      {children}
    </button>
  );
}

function ColorPicker({ label, colors, onPick, title }: { label: React.ReactNode; colors: string[]; onPick: (c: string) => void; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        title={title}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted"
      >
        {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute z-30 mt-1 left-0 rounded-md border bg-popover p-1.5 shadow-md grid grid-cols-5 gap-1">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onPick(c); setOpen(false); }}
                className="h-5 w-5 rounded border"
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
