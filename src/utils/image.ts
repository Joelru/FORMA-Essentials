/**
 * Utilidades para comprimir imágenes antes de guardarlas en LocalStorage y Firebase Firestore
 * (Evita superar el límite de 1 MiB por documento en Firestore).
 */

const MAX_INLINE_DATA_URL_CHARS = 120_000;

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
    img.src = src;
  });
}

function renderCompressedCanvas(
  img: HTMLImageElement,
  maxDimension: number,
  quality: number
): string {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  if (!width || !height) {
    throw new Error('Dimensiones de imagen inválidas');
  }

  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Contexto 2D no disponible');
  }

  // Fondo blanco para PNGs con transparencia al convertir a JPEG
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const webpUrl = canvas.toDataURL('image/webp', quality);
  const jpegUrl = canvas.toDataURL('image/jpeg', quality);

  // En algunos navegadores (Safari antiguos) toDataURL('image/webp') retorna image/png
  if (webpUrl.startsWith('data:image/webp') && webpUrl.length < jpegUrl.length) {
    return webpUrl;
  }
  return jpegUrl;
}

/**
 * Comprime una Data URL base64 si supera el umbral seguro para Firestore.
 */
export async function compressBase64DataUrl(
  dataUrl: string,
  maxDimension = 720,
  quality = 0.76
): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }
  if (dataUrl.length <= MAX_INLINE_DATA_URL_CHARS) {
    return dataUrl;
  }

  try {
    const img = await loadImageElement(dataUrl);
    let result = renderCompressedCanvas(img, maxDimension, quality);

    if (result.length > MAX_INLINE_DATA_URL_CHARS) {
      result = renderCompressedCanvas(img, 540, 0.65);
    }
    if (result.length > MAX_INLINE_DATA_URL_CHARS) {
      result = renderCompressedCanvas(img, 420, 0.55);
    }
    return result.length < dataUrl.length ? result : dataUrl;
  } catch {
    return dataUrl;
  }
}

/**
 * Lee un File seleccionado por el administrador y lo comprime para carga rápida y segura.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 720,
  quality = 0.78
): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('No se pudo leer el archivo de imagen'));
      }
    };
    reader.onerror = () => reject(new Error('Error leyendo el archivo'));
    reader.readAsDataURL(file);
  });

  if (rawDataUrl.length <= 60_000) {
    return rawDataUrl;
  }

  try {
    const img = await loadImageElement(rawDataUrl);
    let compressed = renderCompressedCanvas(img, maxDimension, quality);
    if (compressed.length > MAX_INLINE_DATA_URL_CHARS) {
      compressed = renderCompressedCanvas(img, 540, 0.66);
    }
    return compressed.length < rawDataUrl.length ? compressed : rawDataUrl;
  } catch {
    return rawDataUrl;
  }
}
