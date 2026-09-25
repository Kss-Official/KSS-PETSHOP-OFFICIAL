const ASSET_VERSIONS: Record<string, string> = {
  cta_cat_sunglasses_flawless_seamless: 'v1788852915',
  health_tips_hero: 'v1789130830',
  profile_dog_cat_watermark: 'v1788887750',
  ChatGPT_Image_Sep_8_2026_10_21_30_PM: 'v1788886319',
  ChatGPT_Image_Sep_9_2026_11_10_18_AM: 'v1788932508',
  copy_of_chatgpt_image_sep_9_2026_11_14_55_am: 'v1788935693',
  ChatGPT_Image_Sep_11_2026_12_16_35_PM: 'v1789109212',
  ChatGPT_Image_Sep_11_2026_12_54_54_PM: 'v1789111520',
  ChatGPT_Image_Sep_11_2026_01_19_07_PM: 'v1789112963',
  ChatGPT_Image_Sep_11_2026_02_49_10_PM: 'v1789118365',
  ChatGPT_Image_Sep_11_2026_06_16_49_PM: 'v1789130830',
  ChatGPT_Image_Sep_9_2026_11_21_47_AM: 'v1788933125',
  ChatGPT_Image_Sep_9_2026_12_39_49_PM: 'v1788937905',
  ChatGPT_Image_Sep_9_2026_01_10_44_PM: 'v1788939755',
};

const ASSET_ALIASES: Record<string, string> = {
  bunny_cts: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  bunny_cta: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  find_vet_cta_bunny: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  pharmacy_cta: 'ChatGPT_Image_Sep_9_2026_11_21_47_AM',
  pharmacy_cts: 'ChatGPT_Image_Sep_9_2026_11_21_47_AM',
  services_cta: 'ChatGPT_Image_Sep_11_2026_12_16_35_PM',
  services_cts: 'ChatGPT_Image_Sep_11_2026_12_16_35_PM',
  service_cta: 'ChatGPT_Image_Sep_11_2026_12_16_35_PM',
  service_cts: 'ChatGPT_Image_Sep_11_2026_12_16_35_PM',
  health_tips_cta: 'ChatGPT_Image_Sep_11_2026_02_49_10_PM',
  health_tips_cts: 'ChatGPT_Image_Sep_11_2026_02_49_10_PM',
  health_tips_hero: 'ChatGPT_Image_Sep_11_2026_06_16_49_PM',
  insurance_cta: 'ChatGPT_Image_Sep_11_2026_12_54_54_PM',
  insurance_cts: 'ChatGPT_Image_Sep_11_2026_12_54_54_PM',
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
};

export function getServiceImageUrl(name: string = '', imageUrl?: string, id: number = 1): string {
  const lower = (name || '').toLowerCase();
  const icon = (imageUrl || '').toLowerCase();

  if (lower.includes('vet') || lower.includes('care') || lower.includes('health') || lower.includes('doctor') || icon.includes('vet')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788797640/service_01_vet_care.jpg';
  }
  if (lower.includes('food') || lower.includes('nutri') || lower.includes('diet') || icon.includes('food')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788802670/service_02_pet_food_rabbit_bowl.jpg';
  }
  if (lower.includes('groom') || lower.includes('bath') || lower.includes('spa') || icon.includes('groom')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788802830/service_03_grooming_puppy_tub.jpg';
  }
  if (lower.includes('pharm') || lower.includes('med') || lower.includes('drug') || icon.includes('pharm')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788802595/service_04_pharmacy_cat_med.jpg';
  }
  if (lower.includes('toy') || lower.includes('play') || lower.includes('enrich') || icon.includes('toy')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788802179/service_05_toys_kittens_play.jpg';
  }
  if (lower.includes('board') || lower.includes('daycare') || lower.includes('stay') || icon.includes('board')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896177/5041fe2b-47be-4fa0-b556-8d2c5926e54b_1.png';
  }
  if (lower.includes('train') || lower.includes('behav') || icon.includes('train')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896174/c1b76666-8097-4311-911e-8b51d62c4739_1.png';
  }
  if (lower.includes('trans') || lower.includes('ambul') || icon.includes('trans')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896169/8e9541cf-3bdc-4ed9-8979-e137acb9e77b_1.png';
  }
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }
  const fallbacks = [
    'https://res.cloudinary.com/vphylrop/image/upload/v1788797640/service_01_vet_care.jpg',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788802670/service_02_pet_food_rabbit_bowl.jpg',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788802830/service_03_grooming_puppy_tub.jpg',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788802595/service_04_pharmacy_cat_med.jpg',
    'https://res.cloudinary.com/vphylrop/image/upload/v1788802179/service_05_toys_kittens_play.jpg',
  ];
  return fallbacks[(Math.max(1, id) - 1) % fallbacks.length];
}

export function getArticleImageUrl(title?: string, imageUrl?: string): string {
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    return imageUrl;
  }
  const cleanTitle = (title || '').trim();
  if (cleanTitle && ARTICLE_IMAGE_MAP[cleanTitle]) {
    return ARTICLE_IMAGE_MAP[cleanTitle];
  }
  if (cleanTitle) {
    const lowerTitle = cleanTitle.toLowerCase();
    for (const [key, url] of Object.entries(ARTICLE_IMAGE_MAP)) {
      if (lowerTitle.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerTitle)) {
        return url;
      }
    }
    if (lowerTitle.includes('nutri') || lowerTitle.includes('food') || lowerTitle.includes('diet')) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896774/Golden_retriever_eating_healthy_food_with_carrots.png';
    }
    if (lowerTitle.includes('vaccin') || lowerTitle.includes('shot') || lowerTitle.includes('doctor')) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896780/Vet_examining_a_cat_with_stethoscope.png';
    }
    if (lowerTitle.includes('groom') || lowerTitle.includes('bath') || lowerTitle.includes('clean')) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896776/Golden_retriever_getting_a_bath_with_bubbles_and_rubber_duck.png';
    }
    if (lowerTitle.includes('sick') || lowerTitle.includes('sign') || lowerTitle.includes('emerg')) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896775/Sick_dog_with_ice_pack_on_head.png';
    }
    if (lowerTitle.includes('indoor') || lowerTitle.includes('cat') || lowerTitle.includes('play') || lowerTitle.includes('engag') || lowerTitle.includes('behav')) {
      return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896779/Playful_cat_with_colorful_ball.png';
    }
  }
  if (imageUrl && ARTICLE_IMAGE_MAP[imageUrl]) {
    return ARTICLE_IMAGE_MAP[imageUrl];
  }
  return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896774/Golden_retriever_eating_healthy_food_with_carrots.png';
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
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1789131563/ChatGPT_Image_Sep_11_2026_06_29_05_PM.png';
  }
  if (s.includes('cat') || s.includes('kitten') || s.includes('feline')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1789132287/ChatGPT_Image_Sep_11_2026_06_41_13_PM.png';
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

export function getProductImageUrl(
  firstParam?: string,
  secondParam?: string,
  id: number = 1
): string {
  // 1. Check if either parameter is a valid absolute HTTP/HTTPS URL that is NOT the generic rabbit bowl placeholder
  const isGenericPlaceholder = (url?: string) =>
    !url ||
    url.includes('service_02_pet_food_rabbit_bowl.jpg') ||
    url.includes('service_01_vet_care.jpg') ||
    url.includes('service_03_grooming_puppy_tub.jpg') ||
    url.includes('service_04_pharmacy_cat_med.jpg');

  if (firstParam && (firstParam.startsWith('http://') || firstParam.startsWith('https://')) && !isGenericPlaceholder(firstParam)) {
    return firstParam;
  }
  if (secondParam && (secondParam.startsWith('http://') || secondParam.startsWith('https://')) && !isGenericPlaceholder(secondParam)) {
    return secondParam;
  }

  // 2. Comprehensive keyword matcher for specific products, brands, and subcategories
  const combined = `${firstParam || ''} ${secondParam || ''}`.toLowerCase();

  // Wet Food & Gravy
  if (combined.includes('sheba') || combined.includes('tuna') || combined.includes('salmon') || combined.includes('fillet') || combined.includes('gravy') || combined.includes('wet food')) {
    return 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80';
  }
  // Dry Dog & Puppy Food
  if (combined.includes('royal canin') || combined.includes('maxi adult') || combined.includes('farmina') || combined.includes('orijen') || combined.includes('dry dog food') || combined.includes('puppy food') || combined.includes('dog food')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895703/7e3d7c1c-875e-4c8b-aec1-305c49fc646b_1.png';
  }
  // Dry Cat & Kitten Food
  if (combined.includes('whiskas') || combined.includes('purina') || combined.includes('applaws') || combined.includes('kitten food') || combined.includes('dry cat food') || combined.includes('cat food')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895662/e17e6de5-60ad-4ad5-be39-9be97c37f09e_1.png';
  }
  // Dog & Cat Treats
  if (combined.includes('dentastix') || combined.includes('dental chew') || combined.includes('dental')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895661/2448c43e-adb1-4b95-8e66-6667e0f7c993_1.png';
  }
  if (combined.includes('treat') || combined.includes('temptation') || combined.includes('sausage') || combined.includes('jerky') || combined.includes('bites') || combined.includes('creamy')) {
    return 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80';
  }
  // Toys & Enrichment
  if (combined.includes('kong') || combined.includes('rubber chew') || combined.includes('chew toy')) {
    return 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80';
  }
  if (combined.includes('ball') || combined.includes('chuckit') || combined.includes('fetch')) {
    return 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80';
  }
  if (combined.includes('puzzle') || combined.includes('brick') || combined.includes('laser') || combined.includes('wand') || combined.includes('toy') || combined.includes('rope')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896179/46d5d20e-fe06-4b2f-afd0-c5fb7d7e10a3_1.png';
  }
  // Cat Litter & Trays
  if (combined.includes('litter') || combined.includes('tofu') || combined.includes('bentonite') || combined.includes('clumping') || combined.includes('tray')) {
    return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80';
  }
  // Cat Trees & Scratchers
  if (combined.includes('scratch') || combined.includes('tree') || combined.includes('tower') || combined.includes('sisal') || combined.includes('post')) {
    return 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&auto=format&fit=crop&q=80';
  }
  // Grooming & Shampoos
  if (combined.includes('furminator') || combined.includes('deshedding') || combined.includes('brush') || combined.includes('comb') || combined.includes('glove')) {
    return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80';
  }
  if (combined.includes('shampoo') || combined.includes('oatmeal') || combined.includes('soap') || combined.includes('wash')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895659/68817e23-cd56-4e36-b8db-9acbdfa5545d_1.png';
  }
  // Walk & Travel / Harnesses / Leashes / Collars
  if (combined.includes('harness') || combined.includes('leash') || combined.includes('collar') || combined.includes('car seat') || combined.includes('booster')) {
    return 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80';
  }
  // Bowls & Feeders / Fountains
  if (combined.includes('fountain') || combined.includes('water fountain') || combined.includes('feeder') || combined.includes('bowl') || combined.includes('diner')) {
    return 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80';
  }
  // Beds, Housing & Mats
  if (combined.includes('bed') || combined.includes('lounge') || combined.includes('mat') || combined.includes('cooling') || combined.includes('cave') || combined.includes('donut')) {
    return 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80';
  }
  // Small Pets - Hay & Feed
  if (combined.includes('hay') || combined.includes('timothy') || combined.includes('nuggets') || combined.includes('pellet') || combined.includes('grass')) {
    return 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80';
  }
  // Small Pets - Birds
  if (combined.includes('bird') || combined.includes('seed') || combined.includes('fruit blend') || combined.includes('cage') || combined.includes('perch')) {
    return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80';
  }
  // Small Pets - Fish & Aquarium
  if (combined.includes('fish') || combined.includes('aquarium') || combined.includes('flake') || combined.includes('conditioner') || combined.includes('filter')) {
    return 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80';
  }
  // Small Pets - Reptiles & Terrarium
  if (combined.includes('reptile') || combined.includes('cricket') || combined.includes('calcium') || combined.includes('terrarium') || combined.includes('uvb')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/3553855e-62e9-4565-9f5a-a5d484ecd080_1.png';
  }
  // Small Pets - Hamster
  if (combined.includes('hamster') || combined.includes('wheel') || combined.includes('tunnel') || combined.includes('playpen')) {
    return 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&auto=format&fit=crop&q=80';
  }

  // General Pharmacy fallback matches
  if (combined.includes('nexgard') || combined.includes('spectra')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788896036/Screenshot_2026-09-09_010242.png';
  }
  if (combined.includes('frontline') || combined.includes('flea') || combined.includes('tick')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895698/00b4a02b-168d-4be6-a4b4-29daad1e6881_1.png';
  }
  if (combined.includes('vetplus') || combined.includes('joint') || combined.includes('synoquin')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895661/2448c43e-adb1-4b95-8e66-6667e0f7c993_1.png';
  }
  if (combined.includes('virbac') || combined.includes('epi-otic') || combined.includes('ear cleaner') || combined.includes('drop')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895659/68817e23-cd56-4e36-b8db-9acbdfa5545d_1.png';
  }

  // Diversified Fallbacks per item ID so adjacent products look unique
  const fallbacks = [
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80',
  ];
  return fallbacks[(Math.max(1, id) - 1) % fallbacks.length];
}

export type WishlistItemType = 'PRODUCT' | 'SERVICE' | 'VET';

export interface WishlistItem {
  id: number;
  itemType: WishlistItemType;
  itemId: number;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  specialization?: string;
  description?: string;
  createdAt?: string;
}



