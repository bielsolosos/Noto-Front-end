export const PROFILE_IMAGE_RULES = {
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSizeBytes: 5 * 1024 * 1024,
  minWidth: 256,
  minHeight: 256,
  outputSize: 512,
  outputMimeType: "image/jpeg",
  outputQuality: 0.92,
} as const;

export function formatMaxFileSizeMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

export function isAcceptedProfileImageMimeType(mimeType: string): boolean {
  return PROFILE_IMAGE_RULES.acceptedMimeTypes.includes(
    mimeType as (typeof PROFILE_IMAGE_RULES.acceptedMimeTypes)[number]
  );
}
