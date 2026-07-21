// Lightweight markdown renderer without adding a dep.
// Handles headings, bold, italics, inline code, lists, links, code blocks.
import { useMemo } from "react";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(text: string) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, '<code class="bg-surface-2 px-1 py-0.5 rounded text-xs">$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-primary underline" href="$2" target="_blank" rel="noreferrer">$1</a>');
  return s;
}

function toHtml(md: string) {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let inCode = false;
  let codeBuf: string[] = [];

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        closeList();
        inCode = true;
        codeBuf = [];
      } else {
        out.push(`<pre class="bg-surface-2 rounded-lg p-3 text-xs overflow-x-auto"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      const sizes = ["text-2xl", "text-xl", "text-lg", "text-base"];
      out.push(`<h${level} class="font-display font-semibold ${sizes[level - 1]} mt-3 mb-1">${renderInline(h[2])}</h${level}>`);
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (!inList) {
        out.push('<ul class="list-disc pl-5 space-y-1 my-2">');
        inList = true;
      }
      out.push(`<li>${renderInline(li[1])}</li>`);
      continue;
    }
    if (!line.trim()) {
      closeList();
      out.push("");
      continue;
    }
    closeList();
    out.push(`<p class="my-2 leading-relaxed">${renderInline(line)}</p>`);
  }
  closeList();
  return out.join("\n");
}

export default function ReactMarkdown({ children }: { children: string }) {
  const html = useMemo(() => toHtml(children ?? ""), [children]);
  return <div className="prose-invert text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}
