import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf': return 'application/pdf';
    case '.doc': return 'application/msword';
    case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.mp3': return 'audio/mpeg';
    case '.wav': return 'audio/wav';
    case '.m4a': return 'audio/mp4';
    case '.ogg': return 'audio/ogg';
    case '.webm': return 'audio/webm';
    case '.aac': return 'audio/aac';
    case '.flac': return 'audio/flac';
    case '.mp4': return 'video/mp4';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.json': return 'application/json';
    case '.zip': return 'application/zip';
    default: return 'application/octet-stream';
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const safeName = path.basename(filename);
    if (!safeName || safeName !== filename) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Read from public/uploads/lms first, then fallback to /tmp/seduai-uploads for Vercel
    let fileBuffer: Buffer | null = null;

    const publicPath = path.join(process.cwd(), 'public', 'uploads', 'lms', safeName);
    try {
      fileBuffer = await readFile(publicPath);
    } catch {
      const tmpPath = path.join(tmpdir(), 'seduai-uploads', safeName);
      try {
        fileBuffer = await readFile(tmpPath);
      } catch {
        fileBuffer = null;
      }
    }

    if (!fileBuffer) {
      return new NextResponse('Tệp không tồn tại hoặc đã bị xóa.', { status: 404 });
    }

    const contentType = getContentType(safeName);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return new NextResponse('Lỗi máy chủ khi đọc tệp', { status: 500 });
  }
}
