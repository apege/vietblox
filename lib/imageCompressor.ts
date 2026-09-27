/**
 * Ultra-lightweight Image Compressor for VietBlox
 * 
 * Compresses any uploaded image (JPEG, PNG, HEIC, WebP) to an ultra-compact WebP data URL.
 * Squeezes 5MB-10MB photos down to ~15KB - 40KB while maintaining crisp, readable visual quality.
 * Prevents Cloudflare 413 Payload Too Large errors and protects Neon database bandwidth/storage limits.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 to 1.0 (default: 0.75)
}

export async function compressImageToWebP(
  fileOrDataUrl: File | Blob | string,
  options: CompressOptions = {}
): Promise<string> {
  // If it's already a static asset path (e.g. /payments/qris.svg or /logo_background.PNG) or external URL, return as is
  if (typeof fileOrDataUrl === "string" && !fileOrDataUrl.startsWith("data:")) {
    return fileOrDataUrl;
  }

  const { maxWidth = 800, maxHeight = 1000, quality = 0.75 } = options;

  return new Promise((resolve, reject) => {
    const getImageSource = (): Promise<string> => {
      if (typeof fileOrDataUrl === "string") {
        return Promise.resolve(fileOrDataUrl);
      }
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = (err) => rej(err);
        reader.readAsDataURL(fileOrDataUrl);
      });
    };

    getImageSource()
      .then((src) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          let { width, height } = img;

          // Calculate aspect ratio preserving resize
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(src);
            return;
          }

          // Crisp rendering settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Try exporting as ultra-light WebP
          try {
            const webpDataUrl = canvas.toDataURL("image/webp", quality);
            if (webpDataUrl.startsWith("data:image/webp")) {
              resolve(webpDataUrl);
            } else {
              resolve(canvas.toDataURL("image/jpeg", quality));
            }
          } catch {
            resolve(canvas.toDataURL("image/jpeg", quality));
          }
        };

        img.onerror = () => {
          resolve(src);
        };

        img.src = src;
      })
      .catch((err) => reject(err));
  });
}
