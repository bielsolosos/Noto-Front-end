interface CropAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropImageToFileOptions {
  imageSrc: string;
  cropAreaPixels: CropAreaPixels;
  fileName: string;
  outputSize: number;
  mimeType: string;
  quality: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}

function getFileNameWithExtension(fileName: string, mimeType: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return `${baseName}.${extension}`;
}

export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function cropImageToFile({
  imageSrc,
  cropAreaPixels,
  fileName,
  outputSize,
  mimeType,
  quality,
}: CropImageToFileOptions): Promise<File> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Não foi possível processar a imagem.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    Math.max(0, Math.round(cropAreaPixels.x)),
    Math.max(0, Math.round(cropAreaPixels.y)),
    Math.max(1, Math.round(cropAreaPixels.width)),
    Math.max(1, Math.round(cropAreaPixels.height)),
    0,
    0,
    outputSize,
    outputSize
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob) {
    throw new Error("Não foi possível finalizar o recorte da imagem.");
  }

  return new File([blob], getFileNameWithExtension(fileName, mimeType), {
    type: mimeType,
  });
}
