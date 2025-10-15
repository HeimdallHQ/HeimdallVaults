const rawBase = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
const normalizedBase = rawBase.replace(/\/+$/, "");

export const apiBase = normalizedBase;

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!normalizedBase) {
    return normalizedPath;
  }
  return `${normalizedBase}${normalizedPath}`;
}
