import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { lmsErrorResponse, requireLmsUser, LmsRequestError } from '@/lib/lms-auth';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
]);

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
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new LmsRequestError('Định dạng tệp chưa được hỗ trợ');
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'lms');
    await mkdir(uploadDir, { recursive: true });
    const storedName = `${randomUUID()}-${safeFileName(file.name)}`;
    await writeFile(path.join(uploadDir, storedName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      success: true,
      data: { name: file.name.slice(0, 160), url: `/uploads/lms/${storedName}`, size: file.size },
    }, { status: 201 });
  } catch (error) {
    return lmsErrorResponse(error);
  }
}
