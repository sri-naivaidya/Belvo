import { createClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'belvo-uploads';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function ensureStorageBucket() {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
  });

  if (error && !error.message.toLowerCase().includes('already exists')) {
    throw error;
  }

  return supabase;
}

export async function uploadPrivateFile(path: string, file: File) {
  const supabase = await ensureStorageBucket();
  const bytes = await file.arrayBuffer();
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, bytes, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  });

  if (error) throw error;
  return data.path;
}

export async function createSignedFileUrl(path: string | null | undefined) {
  if (!path) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}
