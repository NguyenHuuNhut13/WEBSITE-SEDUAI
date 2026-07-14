import { LmsRequestError } from '@/lib/lms-auth';

export interface LmsAttachmentInput {
  name: string;
  url: string;
  size?: number;
}

export function requiredText(value: unknown, label: string, maxLength = 200): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new LmsRequestError(`${label} là bắt buộc`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new LmsRequestError(`${label} không được vượt quá ${maxLength} ký tự`);
  }
  return normalized;
}

export function optionalText(value: unknown, label: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw new LmsRequestError(`${label} không hợp lệ`);
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new LmsRequestError(`${label} không được vượt quá ${maxLength} ký tự`);
  }
  return normalized;
}

export function optionalLongText(value: unknown, label: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw new LmsRequestError(`${label} không hợp lệ`);
  if (value.length > maxLength) {
    throw new LmsRequestError(`${label} không được vượt quá ${maxLength} ký tự`);
  }
  return value;
}

export function positiveInteger(value: unknown, label: string, min: number, max: number): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new LmsRequestError(`${label} phải là số nguyên từ ${min} đến ${max}`);
  }
  return parsed;
}

export function optionalDate(value: unknown, label: string): Date | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw new LmsRequestError(`${label} không hợp lệ`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new LmsRequestError(`${label} không hợp lệ`);
  return date;
}

export function enumValue<T extends string>(value: unknown, label: string, values: readonly T[]): T {
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new LmsRequestError(`${label} không hợp lệ`);
  }
  return value as T;
}

export function stringIdList(value: unknown, label: string, maxItems: number): string[] {
  if (!Array.isArray(value)) throw new LmsRequestError(`${label} phải là một danh sách`);
  const ids = [...new Set(value.map((item) => typeof item === 'string' ? item.trim() : '').filter(Boolean))];
  if (ids.length > maxItems) throw new LmsRequestError(`${label} chỉ được có tối đa ${maxItems} phần tử`);
  return ids;
}

export function normalizeAttachments(value: unknown, label = 'Tệp đính kèm'): LmsAttachmentInput[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) throw new LmsRequestError(`${label} phải là một danh sách`);
  if (value.length > 10) throw new LmsRequestError(`${label} chỉ được có tối đa 10 tệp`);

  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new LmsRequestError(`${label} #${index + 1} không hợp lệ`);
    const record = item as Record<string, unknown>;
    const name = requiredText(record.name, `Tên tệp #${index + 1}`, 160);
    const rawUrl = requiredText(record.url, `URL tệp #${index + 1}`, 2_000);
    let url: URL;
    try {
      url = new URL(rawUrl);
    } catch {
      throw new LmsRequestError(`URL tệp #${index + 1} không hợp lệ`);
    }
    if (!['https:', 'http:'].includes(url.protocol)) {
      throw new LmsRequestError(`URL tệp #${index + 1} chỉ được dùng HTTP hoặc HTTPS`);
    }

    const size = record.size === undefined ? undefined : Number(record.size);
    if (size !== undefined && (!Number.isFinite(size) || size < 0 || size > 25 * 1024 * 1024)) {
      throw new LmsRequestError(`Kích thước tệp #${index + 1} không hợp lệ`);
    }
    return { name, url: url.toString(), ...(size !== undefined ? { size } : {}) };
  });
}
