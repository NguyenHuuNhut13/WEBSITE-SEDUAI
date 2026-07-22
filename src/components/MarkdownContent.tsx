'use client';

import React from 'react';
import { BookOpen, CheckCircle2, Code2, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;

  // Split lines to parse blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeBuffer: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (keyPrefix: string) => {
    if (!currentList) return;
    const ListTag = currentList.type === 'ol' ? 'ol' : 'ul';
    elements.push(
      <ListTag
        key={`${keyPrefix}-list-${elements.length}`}
        className={`my-3 space-y-2 text-xs sm:text-sm text-slate-700 ${
          currentList.type === 'ol' ? 'list-decimal pl-5 font-medium' : 'pl-1'
        }`}
      >
        {currentList.items.map((item, idx) => (
          <li key={idx} className="leading-relaxed flex items-start gap-2">
            {currentList?.type === 'ul' && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            )}
            <span className="flex-1">{renderFormattedText(item)}</span>
          </li>
        ))}
      </ListTag>
    );
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block toggles ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <div key={`code-${i}`} className="my-4 overflow-hidden border border-slate-800 bg-slate-900 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-400">
                <Code2 className="h-3.5 w-3.5" /> {codeLang || 'CODE'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">UTF-8</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-xs text-emerald-300 leading-relaxed">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList(`code-start-${i}`);
        inCodeBlock = true;
        codeLang = trimmed.replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // 2. Empty line
    if (!trimmed) {
      flushList(`empty-${i}`);
      continue;
    }

    // 3. Headings #, ##, ###
    if (trimmed.startsWith('# ')) {
      flushList(`h1-${i}`);
      elements.push(
        <h1 key={`h1-${i}`} className="mt-6 mb-4 pb-2 text-xl font-black text-slate-900 border-b-2 border-primary/20 flex items-center gap-2 tracking-tight">
          <BookOpen className="w-5 h-5 text-primary" /> {renderFormattedText(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`h2-${i}`);
      elements.push(
        <h2 key={`h2-${i}`} className="mt-5 mb-3 text-base font-extrabold text-blue-950 border-b border-slate-200/80 pb-1.5 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> {renderFormattedText(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`h3-${i}`);
      elements.push(
        <h3 key={`h3-${i}`} className="mt-4 mb-2 text-sm font-bold text-slate-900 bg-blue-50/70 border-l-4 border-primary px-3 py-1.5 flex items-center gap-2">
          {renderFormattedText(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      flushList(`h4-${i}`);
      elements.push(
        <h4 key={`h4-${i}`} className="mt-3 mb-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          {renderFormattedText(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      continue;
    }

    // 4. Blockquotes / Callout >
    if (trimmed.startsWith('>')) {
      flushList(`quote-${i}`);
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${i}`} className="my-3 border-l-4 border-amber-500 bg-amber-50/80 p-3.5 text-xs font-medium text-amber-900 shadow-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{renderFormattedText(quoteText)}</div>
        </div>
      );
      continue;
    }

    // 5. Unordered List (- or *)
    const ulMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(`ul-switch-${i}`);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // 6. Ordered List (1. 2.)
    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(`ol-switch-${i}`);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // 7. Regular paragraph
    flushList(`p-${i}`);
    elements.push(
      <p key={`p-${i}`} className="my-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {renderFormattedText(trimmed)}
      </p>
    );
  }

  flushList('final');

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}

/** Formats **bold**, `inline code`, and score badges like [3.0 điểm] */
function renderFormattedText(text: string): React.ReactNode {
  // Regex to extract **bold**, `inline code`, and score badges
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Pattern matches **bold**, `code`, or score mentions (e.g. 3.0 điểm)
  const regex = /(\*\*(.*?)\*\*|`(.*?)`|(\d+(?:\.\d+)?\s*(?:điểm|đ)))/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
      const boldText = match[2];
      parts.push(
        <strong key={match.index} className="font-black text-slate-900 bg-slate-100/90 px-1 py-0.5 border-b border-slate-300">
          {boldText}
        </strong>
      );
    } else if (fullMatch.startsWith('`') && fullMatch.endsWith('`')) {
      const codeText = match[3];
      parts.push(
        <code key={match.index} className="font-mono text-xs bg-slate-100 text-primary px-1.5 py-0.5 border border-slate-200">
          {codeText}
        </code>
      );
    } else if (match[4]) {
      // Score badge like 3.0 điểm
      parts.push(
        <span key={match.index} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 text-[11px] border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {match[4]}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
