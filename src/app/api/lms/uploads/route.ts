import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { lmsErrorResponse, requireLmsUser, LmsRequestError } from '@/lib/lms-auth';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

// Allowed MIME types including document, image, audio, and video formats
const ALLOWED_TYPES = new Set([
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
  'text/markdown',

  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',

  // Audio Formats (Voice recordings, audio submissions)
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/flac',

  // Video Formats
  'video/mp4',
  'video/webm',
  'video/ogg',
]);

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm', '.flac', '.mp4', '.wma']);

function safeFileName(name: string) {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 120);
  return base || 'upload.bin';
}

export async function POST(request: NextRequest) {
  try {
    await requireLmsUser(request, ['ADMIN', 'TEACHER', 'STUDENT']);
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) throw new LmsRequestError('Cần chọn một tệp để tải lên');
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      throw new LmsRequestError('Tệp phải lớn hơn 0 và không vượt quá 25 MB');
    }

    const ext = path.extname(file.name).toLowerCase();
    const isAudio = file.type.startsWith('audio/') || AUDIO_EXTENSIONS.has(ext);

    if (!ALLOWED_TYPES.has(file.type) && !isAudio) {
      throw new LmsRequestError('Định dạng tệp chưa được hỗ trợ');
    }

    const storedName = `${randomUUID()}-${safeFileName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    let targetDir = path.join(process.cwd(), 'public', 'uploads', 'lms');

    try {
      await mkdir(targetDir, { recursive: true });
      await writeFile(path.join(targetDir, storedName), buffer);
    } catch {
      // Fallback for read-only Vercel / serverless environment (/var/task/public error)
      targetDir = path.join(tmpdir(), 'seduai-uploads');
      await mkdir(targetDir, { recursive: true });
      await writeFile(path.join(targetDir, storedName), buffer);
    }

    // Served via /api/lms/uploads/[filename] so Vercel can stream files from /tmp cleanly
    const fileUrl = `/api/lms/uploads/${storedName}`;

    return NextResponse.json({
      success: true,
      data: {
        name: file.name.slice(0, 160),
        url: fileUrl,
        size: file.size,
        type: file.type || (isAudio ? 'audio/mpeg' : 'application/octet-stream')
      },
    }, { status: 201 });
  } catch (error) {
    return lmsErrorResponse(error);
  }
}
