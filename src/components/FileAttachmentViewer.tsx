'use client';

import React from 'react';
import { Volume2, Download, FileText, FileCode, Film, Image as ImageIcon } from 'lucide-react';

interface FileItem {
  name?: string;
  url?: string;
  type?: string;
}

interface FileAttachmentViewerProps {
  files: unknown;
  title?: string;
}

function parseFileList(raw: unknown): FileItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function isAudioFile(name?: string, type?: string): boolean {
  if (type && type.startsWith('audio/')) return true;
  if (!name) return false;
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'));
  return ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm', '.flac', '.wma'].includes(ext);
}

function isImageFile(name?: string, type?: string): boolean {
  if (type && type.startsWith('image/')) return true;
  if (!name) return false;
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'));
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
}

export default function FileAttachmentViewer({ files, title = 'Tệp đính kèm' }: FileAttachmentViewerProps) {
  const fileList = parseFileList(files);

  if (fileList.length === 0) return null;

  return (
    <div className="space-y-3 my-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-primary" /> {title} ({fileList.length})
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {fileList.map((file, idx) => {
          const fileName = file.name?.trim() || `Tệp ${idx + 1}`;
          const fileUrl = file.url?.trim() || '#';
          const isAudio = isAudioFile(fileName, file.type);
          const isImage = isImageFile(fileName, file.type);

          if (isAudio) {
            return (
              <div
                key={idx}
                className="p-3 bg-slate-900 border border-slate-800 text-white rounded-none shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold truncate text-slate-200">{fileName}</span>
                  </div>
                  <a
                    href={fileUrl}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white transition shrink-0"
                    title="Tải xuống tệp âm thanh"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
                {/* HTML5 Audio Player */}
                <audio
                  controls
                  src={fileUrl}
                  className="w-full h-8 rounded-none accent-primary border border-slate-700"
                  preload="metadata"
                >
                  Trình duyệt của bạn không hỗ trợ phát âm thanh trực tiếp.
                </audio>
              </div>
            );
          }

          if (isImage) {
            return (
              <div
                key={idx}
                className="p-2.5 bg-white border border-slate-200 rounded-none shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden text-xs font-bold text-slate-800">
                    <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    Xem ảnh <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="border border-slate-100 max-h-48 overflow-hidden bg-slate-900 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fileUrl} alt={fileName} className="max-h-48 object-contain" />
                </div>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-none hover:border-primary transition text-xs font-bold text-slate-800 group"
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate max-w-[240px] sm:max-w-xs">{fileName}</span>
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-500 hover:text-primary transition shrink-0 flex items-center gap-1"
                title="Tải xuống tệp"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
