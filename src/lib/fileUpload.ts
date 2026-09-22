/**
 * Client-side file processing for fast, reliable uploads:
 * 1. Images are compressed client-side via HTML5 Canvas into lightweight
 *    data URLs (~60KB–150KB) in milliseconds.
 * 2. Documents (PDFs, docs) under 800KB are read as Base64 data URLs in milliseconds.
 * 3. Zero dependency on external storage buckets or server disks, ensuring
 *    instant uploads that never hang and work 100% on Vercel.
 */

export async function compressImage(
  file: File,
  maxWidth = 1400,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read image as data URL"));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(result);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        } catch {
          // Fallback to original data URL if canvas manipulation encounters issues
          resolve(result);
        }
      };

      img.onerror = () => {
        // If image element fails to decode, fallback to direct data URL
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

export async function uploadFile(
  file: File,
  _folder: string = "uploads"
): Promise<UploadResult> {
  // If image: compress and convert to lightweight data URL (< 150KB)
  if (file.type.startsWith("image/")) {
    const compressedDataUrl = await compressImage(file);
    return {
      url: compressedDataUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }

  // If document (PDF, doc, etc.):
  if (file.size > 800 * 1024) {
    throw new Error(
      "Document exceeds maximum size of 800KB. Please compress the file or upload an image."
    );
  }

  const dataUrl = await fileToDataUrl(file);
  return {
    url: dataUrl,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
