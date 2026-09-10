const ASSET_VERSIONS: Record<string, string> = {
  cta_cat_sunglasses_flawless_seamless: 'v1788852915',
  health_tips_hero: 'v1788887698',
  profile_dog_cat_watermark: 'v1788887750',
  ChatGPT_Image_Sep_8_2026_10_21_30_PM: 'v1788886319',
  ChatGPT_Image_Sep_9_2026_11_10_18_AM: 'v1788932508',
  copy_of_chatgpt_image_sep_9_2026_11_14_55_am: 'v1788935693',
  ChatGPT_Image_Sep_9_2026_11_21_47_AM: 'v1788933125',
  ChatGPT_Image_Sep_9_2026_12_39_49_PM: 'v1788937905',
};

const ASSET_ALIASES: Record<string, string> = {
  bunny_cts: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  bunny_cta: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  find_vet_cta_bunny: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  pharmacy_cta: 'ChatGPT_Image_Sep_9_2026_11_21_47_AM',
  pharmacy_cts: 'ChatGPT_Image_Sep_9_2026_11_21_47_AM',
  services_cta: 'copy_of_chatgpt_image_sep_9_2026_11_14_55_am',
  services_cts: 'copy_of_chatgpt_image_sep_9_2026_11_14_55_am',
  service_cta: 'copy_of_chatgpt_image_sep_9_2026_11_14_55_am',
  service_cts: 'copy_of_chatgpt_image_sep_9_2026_11_14_55_am',
  health_tips_cta: 'ChatGPT_Image_Sep_9_2026_11_10_18_AM',
  health_tips_cts: 'ChatGPT_Image_Sep_9_2026_11_10_18_AM',
  insurance_cta: 'ChatGPT_Image_Sep_9_2026_12_39_49_PM',
  insurance_cts: 'ChatGPT_Image_Sep_9_2026_12_39_49_PM',
};

/**
 * Utility helper to build Cloudinary asset URLs from environment configuration
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options: string = 'f_auto,q_auto'
): string {
  if (!publicId) return '';
  const targetId = ASSET_ALIASES[publicId] || publicId;
  const cloudName = (
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    'vphylrop'
  )
    .trim()
    .toLowerCase();

  const version = ASSET_VERSIONS[targetId] ? `${ASSET_VERSIONS[targetId]}/` : '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${options}/${version}${targetId}`;
}

const VET_DATABASE_PHOTO_MAP: Record<string, string> = {
  vet_dr_sarah_mitchell: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  vet_dr_james_carter: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  avatar_user_1: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  avatar_user_2: 'https://images.unsplash.com/photo-1594824813571-24a69c100d47?auto=format&fit=crop&q=80&w=600',
  avatar_user_3: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
  avatar_user_4: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
};

const DEFAULT_VET_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1594824813571-24a69c100d47?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
];

/**
 * Returns a high-resolution veterinarian photo URL.
 */
export function getVetImageUrl(vetName: string = '', photoUrl?: string, vetId?: number | string): string {
  if (photoUrl && photoUrl.trim() !== '') {
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    if (VET_DATABASE_PHOTO_MAP[photoUrl]) {
      return VET_DATABASE_PHOTO_MAP[photoUrl];
    }
    return getCloudinaryImageUrl(photoUrl);
  }
  const idNum = typeof vetId === 'number' ? vetId : (vetName.length || 1);
  return DEFAULT_VET_IMAGES[Math.abs(Number(idNum)) % DEFAULT_VET_IMAGES.length];
}

/**
 * Returns a high-resolution Cloudinary image URL corresponding to the pet's species.
 */
export function getPetSpeciesImage(species?: string, customImage?: string): string {
  if (customImage && customImage.trim() !== '') {
    return customImage;
  }

  const s = (species || '').trim().toLowerCase();

  if (s.includes('dog') || s.includes('puppy') || s.includes('canine')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895238/be7aa286-04e9-4307-b2f4-6dc218dfb17f_1.png';
  }
  if (s.includes('cat') || s.includes('kitten') || s.includes('feline')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895237/17d0f799-c458-4c6c-a0a6-80d8cf71e496_1.png';
  }
  if (s.includes('rabbit') || s.includes('bunny') || s.includes('hare')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/886e967f-9a24-48c5-aeff-ff8e6f6a00e6_1.png';
  }
  if (
    s.includes('bird') ||
    s.includes('parrot') ||
    s.includes('avian') ||
    s.includes('cockatiel') ||
    s.includes('canary') ||
    s.includes('finch')
  ) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/ce452fe3-fdc7-4140-8b94-6c0f373622db_1.png';
  }
  if (
    s.includes('small') ||
    s.includes('hamster') ||
    s.includes('guinea') ||
    s.includes('ferret') ||
    s.includes('rat') ||
    s.includes('mouse') ||
    s.includes('gerbil') ||
    s.includes('rodent')
  ) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/c0d11401-6185-488d-9267-a5235e16375a_1.png';
  }
  if (s.includes('fish') || s.includes('aquarium') || s.includes('goldfish') || s.includes('betta')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/119ae58d-9928-4822-afb6-97826bd4341c_1.png';
  }
  if (
    s.includes('reptile') ||
    s.includes('snake') ||
    s.includes('lizard') ||
    s.includes('turtle') ||
    s.includes('gecko') ||
    s.includes('chameleon') ||
    s.includes('iguana') ||
    s.includes('tortoise') ||
    s.includes('other')
  ) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/3553855e-62e9-4565-9f5a-a5d484ecd080_1.png';
  }

  // Default to Reptile portrait for Other / unspecified pet species
  return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/3553855e-62e9-4565-9f5a-a5d484ecd080_1.png';
}

/**
 * Shared INR currency formatter — use this everywhere in the customer portal.
 * Formats as ₹X,XX,XXX using the en-IN locale (e.g. ₹1,299, ₹500).
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export interface WishlistItem {
  id: number;
  name: string;
  category: string;
  price: number;
  rating?: number;
  stockQuantity?: number;
  imageUrl?: string;
  description?: string;
}

export function getWishlistItems(): WishlistItem[] {
  try {
    const data = localStorage.getItem('pawsitive_wishlist');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isItemWishlisted(id: number): boolean {
  const items = getWishlistItems();
  return items.some((item) => item.id === id);
}

export function toggleWishlistItem(product: WishlistItem): boolean {
  try {
    const items = getWishlistItems();
    const index = items.findIndex((i) => i.id === product.id);
    let isAdded = false;
    if (index > -1) {
      items.splice(index, 1);
      isAdded = false;
    } else {
      items.push(product);
      isAdded = true;
    }
    localStorage.setItem('pawsitive_wishlist', JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
    return isAdded;
  } catch {
    return false;
  }
}

export function removeWishlistItem(id: number): void {
  try {
    const items = getWishlistItems().filter((item) => item.id !== id);
    localStorage.setItem('pawsitive_wishlist', JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
  } catch {
    // Fail safe
  }
}

