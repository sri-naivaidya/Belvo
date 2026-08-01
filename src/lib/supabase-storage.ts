// File storage helper — files are served by the BELVO Express server
// (multer → /uploads, proxied via the Vite dev server).

export const STORAGE_BUCKET = 'belvo-uploads';

export async function ensureStorageBucket() {
  return true;
}

export async function uploadPrivateFile(path: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('path', path);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return path;
}

export async function createSignedFileUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return path.startsWith('/uploads/') ? path : `/uploads/${path.replace(/^\//, '')}`;
}
