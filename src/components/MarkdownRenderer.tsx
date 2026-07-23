'use client';

import React, { useState } from 'react';
import { Copy, Check, Info, Lightbulb, AlertTriangle, HelpCircle, ChevronRight, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function InlineMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Code inline `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 bg-slate-100 text-rose-600 font-mono text-xs border border-slate-200 rounded-none font-semibold"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-extrabold text-slate-900">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic *text* or _text_
    const italicMatch = remaining.match(/^[*_]([^*_]+)[*_]/);
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic text-slate-800">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Link [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      parts.push(
        <a
          key={keyIdx++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-bold hover:underline underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Plain text character or chunk up to next special char
    const nextCharIdx = remaining.search(/[`*_\[]/);
    if (nextCharIdx === -1) {
      parts.push(remaining);
      break;
    } else if (nextCharIdx === 0) {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      parts.push(remaining.slice(0, nextCharIdx));
      remaining = remaining.slice(nextCharIdx);
    }
  }

  return <>{parts}</>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-5 border border-slate-800 bg-slate-950 rounded-none shadow-md overflow-hidden font-mono text-xs">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            {language || 'code'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-none text-[10px] font-bold transition cursor-pointer border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" /> Đã chép!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-slate-400" /> Sao chép
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto leading-relaxed text-slate-200 font-mono">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition">
                <td className="w-8 select-none text-right pr-4 text-slate-600 text-[11px] border-r border-slate-800/80">
                  {idx + 1}
                </td>
                <td className="pl-4 whitespace-pre">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto border border-slate-200 rounded-none shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-3 border-b border-slate-800">
                <InlineMarkdown text={h.trim()} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-3 text-slate-700 border-r border-slate-100 last:border-r-0">
                  <InlineMarkdown text={cell.trim()} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) {
    return <p className="text-slate-400 italic">Bài học này chưa có nội dung chi tiết.</p>;
  }

  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```
    if (line.trim().startsWith('```')) {
      const language = line.trim().replace(/^```/, '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip ending ```
      blocks.push(<CodeBlock key={keyCounter++} code={codeLines.join('\n')} language={language} />);
      continue;
    }

    // Markdown Table | ... |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const headers = line.split('|').slice(1, -1);
      i++;
      // Skip separator line |---|---|
      if (i < lines.length && lines[i].includes('---')) {
        i++;
      }
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        rows.push(lines[i].split('|').slice(1, -1));
        i++;
      }
      blocks.push(<TableBlock key={keyCounter++} headers={headers} rows={rows} />);
      continue;
    }

    // Headings #, ##, ###, ####
    const h1Match = line.match(/^#\s+(.*)$/);
    if (h1Match) {
      blocks.push(
        <div key={keyCounter++} className="mt-8 mb-4 pb-2 border-b-2 border-primary">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-3 h-6 bg-primary rounded-none inline-block"></span>
            <InlineMarkdown text={h1Match[1]} />
          </h1>
        </div>
      );
      i++;
      continue;
    }

    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      blocks.push(
        <div key={keyCounter++} className="mt-7 mb-3 pb-1.5 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-primary" />
            <InlineMarkdown text={h2Match[1]} />
          </h2>
        </div>
      );
      i++;
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) {
      blocks.push(
        <h3 key={keyCounter++} className="mt-5 mb-2 text-base font-extrabold text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-primary rounded-none"></span>
          <InlineMarkdown text={h3Match[1]} />
        </h3>
      );
      i++;
      continue;
    }

    const h4Match = line.match(/^####\s+(.*)$/);
    if (h4Match) {
      blocks.push(
        <h4 key={keyCounter++} className="mt-4 mb-2 text-sm font-bold text-slate-800">
          <InlineMarkdown text={h4Match[1]} />
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote > or Alert boxes
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s*/, ''));
        i++;
      }
      const fullQuote = quoteLines.join('\n');

      let alertType: 'note' | 'tip' | 'warning' | 'info' = 'note';
      let cleanText = fullQuote;

      if (fullQuote.startsWith('[!NOTE]')) {
        alertType = 'note';
        cleanText = fullQuote.replace('[!NOTE]', '').trim();
      } else if (fullQuote.startsWith('[!TIP]')) {
        alertType = 'tip';
        cleanText = fullQuote.replace('[!TIP]', '').trim();
      } else if (fullQuote.startsWith('[!WARNING]') || fullQuote.startsWith('[!IMPORTANT]')) {
        alertType = 'warning';
        cleanText = fullQuote.replace(/\[!(WARNING|IMPORTANT)\]/, '').trim();
      }

      const alertStyles = {
        note: { bg: 'bg-blue-50/80', border: 'border-l-4 border-blue-600 border-t border-r border-b border-blue-200', text: 'text-blue-900', icon: Info },
        tip: { bg: 'bg-emerald-50/80', border: 'border-l-4 border-emerald-600 border-t border-r border-b border-emerald-200', text: 'text-emerald-900', icon: Lightbulb },
        warning: { bg: 'bg-amber-50/80', border: 'border-l-4 border-amber-600 border-t border-r border-b border-amber-200', text: 'text-amber-900', icon: AlertTriangle },
        info: { bg: 'bg-slate-50', border: 'border-l-4 border-slate-600 border-t border-r border-b border-slate-200', text: 'text-slate-900', icon: HelpCircle },
      }[alertType];

      const IconComponent = alertStyles.icon;

      blocks.push(
        <div key={keyCounter++} className={`my-4 p-4 ${alertStyles.bg} ${alertStyles.border} rounded-none shadow-sm`}>
          <div className="flex items-start gap-2.5">
            <IconComponent className={`w-5 h-5 ${alertStyles.text} shrink-0 mt-0.5`} />
            <div className={`text-xs font-medium ${alertStyles.text} leading-relaxed space-y-1`}>
              <InlineMarkdown text={cleanText} />
            </div>
          </div>
        </div>
      );
      continue;
    }

    // Bullet lists - or *
    if (line.trim().match(/^[-*+]\s+(.*)$/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*+]\s+(.*)$/)) {
        const itemMatch = lines[i].trim().match(/^[-*+]\s+(.*)$/);
        if (itemMatch) listItems.push(itemMatch[1]);
        i++;
      }
      blocks.push(
        <ul key={keyCounter++} className="my-3 space-y-1.5 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-1.5 h-1.5 bg-primary rounded-none mt-2 shrink-0" />
              <div>
                <InlineMarkdown text={item} />
              </div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered lists 1. 2.
    if (line.trim().match(/^\d+\.\s+(.*)$/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+(.*)$/)) {
        const itemMatch = lines[i].trim().match(/^\d+\.\s+(.*)$/);
        if (itemMatch) listItems.push(itemMatch[1]);
        i++;
      }
      blocks.push(
        <ol key={keyCounter++} className="my-3 space-y-1.5 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-4 h-4 bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200 rounded-none">
                {idx + 1}
              </span>
              <div>
                <InlineMarkdown text={item} />
              </div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p key={keyCounter++} className="my-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <div className={`prose-custom space-y-1 ${className}`}>{blocks}</div>;
}
