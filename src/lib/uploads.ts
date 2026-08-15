import { supabase } from "@/integrations/supabase/client";

export const CMS_BUCKET = "cms-images";
export const CMS_IMAGE_PREFIX = "/api/public/cms-image/";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type UploadFolder = "products" | "categories" | "projects" | "branding";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** true when the value points at an image we own in Cloud storage. */
export function isStorageImage(value: string | null | undefined): boolean {
  return !!value && value.startsWith(CMS_IMAGE_PREFIX);
}

export function storagePathFromUrl(value: string): string | null {
  return isStorageImage(value) ? value.slice(CMS_IMAGE_PREFIX.length) : null;
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPEG, PNG or WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "File is too large. Maximum size is 5 MB.";
  }
  return null;
}

/** Uploads an image and returns the public URL to store in the database. */
export async function uploadCmsImage(file: File, folder: UploadFolder): Promise<string> {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);

  const ext = EXT[file.type] ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(CMS_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (error) throw new Error(error.message);
  return `${CMS_IMAGE_PREFIX}${path}`;
}

/** Deletes an uploaded image, but only when nothing else references it. */
export async function deleteCmsImageIfUnused(
  value: string | null | undefined,
  allReferences: string[],
): Promise<void> {
  const path = value ? storagePathFromUrl(value) : null;
  if (!path) return;

  const uses = allReferences.filter((ref) => ref === value).length;
  if (uses > 1) return;

  await supabase.storage.from(CMS_BUCKET).remove([path]);
}

/** Every image reference currently stored across CMS tables. */
export function collectImageReferences(data: any): string[] {
  if (!data) return [];
  const out: string[] = [];
  for (const row of data.categories ?? []) if (row.image) out.push(row.image);
  for (const row of data.projects ?? []) if (row.image) out.push(row.image);
  for (const row of data.products ?? []) for (const img of row.images ?? []) out.push(img);
  return out;
}
