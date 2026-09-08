const ASSET_VERSIONS: Record<string, string> = {
  cta_cat_sunglasses_flawless_seamless: 'v1788852915',
};

/**
 * Utility helper to build Cloudinary asset URLs from environment configuration
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options: string = 'f_auto,q_auto'
): string {
  if (!publicId) return '';
  const cloudName = (
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    'vphylrop'
  )
    .trim()
    .toLowerCase();

  const version = ASSET_VERSIONS[publicId] ? `${ASSET_VERSIONS[publicId]}/` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${version}${publicId}`;
}
