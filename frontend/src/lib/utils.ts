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
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }
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

const ARTICLE_IMAGE_MAP: Record<string, string> = {
  'Grooming Tips for a Cleaner and Healthier Pet': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896776/Golden_retriever_getting_a_bath_with_bubbles_and_rubber_duck.png',
  'Common Signs Your Pet Might Be Sick': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896775/Sick_dog_with_ice_pack_on_head.png',
  'Essential Vaccinations for Dogs and Cats': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896780/Vet_examining_a_cat_with_stethoscope.png',
  'The Right Nutrition for a Healthier, Happier Pet': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896774/Golden_retriever_eating_healthy_food_with_carrots.png',
  'How to Keep Your Indoor Cat Active and Engaged': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896779/Playful_cat_with_colorful_ball.png',
  'service_03_grooming_puppy_tub': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896776/Golden_retriever_getting_a_bath_with_bubbles_and_rubber_duck.png',
  'service_04_pharmacy_cat_med': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896775/Sick_dog_with_ice_pack_on_head.png',
  'service_01_vet_care': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896780/Vet_examining_a_cat_with_stethoscope.png',
  'service_02_pet_food_rabbit_bowl': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896774/Golden_retriever_eating_healthy_food_with_carrots.png',
  'service_05_toys_kittens_play': 'https://res.cloudinary.com/vphylrop/image/upload/v1788896779/Playful_cat_with_colorful_ball.png',
};

export function getArticleImageUrl(title?: string, imageUrl?: string): string {
  if (title && ARTICLE_IMAGE_MAP[title]) {
    return ARTICLE_IMAGE_MAP[title];
  }
  if (imageUrl && ARTICLE_IMAGE_MAP[imageUrl]) {
    return ARTICLE_IMAGE_MAP[imageUrl];
  }
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }
  return getCloudinaryImageUrl(imageUrl || 'health_tips_hero');
}

/**
 * Fixed Cloudinary image URLs for known veterinarians.
 * These are permanent and must not be changed.
 */
const VET_NAME_PHOTO_MAP: Record<string, string> = {
  'Dr. Sarah Mitchell':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891282/high_resolution_professional_commercial_studio_portrait_of_a_young_female.png',
  'Dr. James Carter':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891283/high_resolution_professional_studio_portrait_of_a_male_doctor_in_his_mid_40s.png',
  'Dr. Rahul Sharma':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891283/high_resolution_professional_commercial_portrait_of_a_young_male_veterinarian.png',
  'Dr. Priya Mehta':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891282/high_resolution_professional_commercial_studio_portrait_of_a_young_female_1.png',
  'Dr. Arjun Verma':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_studio_portrait_of_a_male_doctor_in_his_late_30s.png',
  'Dr. Neha Kapoor':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_commercial_studio_portrait_of_a_female.png',
  'Dr. David Chen':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891263/high_resolution_professional_studio_portrait_of_an_east_asian_male_veterinary.png',
  'Dr. Emily Watson':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891264/high_resolution_professional_studio_portrait_of_a_senior_female_veterinary.png',
  'Dr. Michael Roberts':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891074/high_resolution_professional_commercial_studio_portrait_of_a_senior_male.png',
  'Dr. Sophia Martinez':
    'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_studio_portrait_of_a_female_veterinarian_doctor_in.png',
};

/**
 * Returns the photo URL for a veterinarian.
 * Priority: (1) valid URL from DB, (2) fixed Cloudinary map by name, (3) SVG placeholder.
 */
export function getVetImageUrl(vetName: string = '', photoUrl?: string, _vetId?: number | string): string {
  // 1. Use the URL from the database if it is a valid absolute URL
  if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
    return photoUrl;
  }
  // 2. Fall back to the fixed Cloudinary map by vet name
  const trimmedName = vetName.trim();
  if (trimmedName && VET_NAME_PHOTO_MAP[trimmedName]) {
    return VET_NAME_PHOTO_MAP[trimmedName];
  }
  // 3. Final fallback: branded SVG placeholder
  const displayName = trimmedName || 'Veterinarian';
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23FAF6EE"/><rect x="12" y="12" width="576" height="376" rx="20" fill="none" stroke="%23E5DFCE" stroke-width="2" stroke-dasharray="8 8"/><g transform="translate(260, 115)" fill="none" stroke="%23548B60" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="30" r="24"/><path d="M5 95c0-20 18-34 35-34s35 14 35 34"/><path d="M40 70v30M25 85h30"/></g><text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="18" fill="%23334437">${encodeURIComponent(displayName)}</text><text x="50%" y="76%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="13" fill="%2367796B">Veterinarian Profile Photo</text></svg>`;
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

/**
 * Derives a vet's consultation fee in INR (₹500–₹800) based on years of experience.
 * - 0–3 yrs  → ₹500
 * - 4–7 yrs  → ₹600
 * - 8–12 yrs → ₹700
 * - 13+ yrs  → ₹800
 * Falls back to ₹500 when experience is unknown.
 */
export function getConsultationFeeINR(experienceYears?: number | null): number {
  const yrs = experienceYears ?? 0;
  if (yrs >= 13) return 800;
  if (yrs >= 8)  return 700;
  if (yrs >= 4)  return 600;
  return 500;
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

