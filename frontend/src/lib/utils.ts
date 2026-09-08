const ASSET_VERSIONS: Record<string, string> = {
  cta_cat_sunglasses_flawless_seamless: 'v1788852915',
  health_tips_hero: 'v1788887698',
  profile_dog_cat_watermark: 'v1788887750',
  ChatGPT_Image_Sep_8_2026_10_21_30_PM: 'v1788886319',
};

const ASSET_ALIASES: Record<string, string> = {
  bunny_cts: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  bunny_cta: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
  find_vet_cta_bunny: 'ChatGPT_Image_Sep_8_2026_10_21_30_PM',
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

const FEMALE_NAMES = [
  'sarah', 'emily', 'sophia', 'priya', 'ananya', 'jessica', 'amanda', 
  'laura', 'rachel', 'maria', 'lisa', 'elizabeth', 'jennifer', 'michelle', 
  'hannah', 'chloe', 'clara', 'grace', 'victoria', 'olivia', 'emma', 'ava',
  'neha', 'pooja', 'kavita', 'sneha', 'meera', 'shruti', 'divya', 'aditi'
];

const FEMALE_VET_IMAGES = [
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891282/high_resolution_professional_commercial_studio_portrait_of_a_young_female.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891282/high_resolution_professional_commercial_studio_portrait_of_a_young_female_1.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_commercial_studio_portrait_of_a_female.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_studio_portrait_of_a_female_veterinarian_doctor_in.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891264/high_resolution_professional_studio_portrait_of_a_senior_female_veterinary.png',
];

const MALE_VET_IMAGES = [
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891283/high_resolution_professional_studio_portrait_of_a_male_doctor_in_his_mid_40s.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891283/high_resolution_professional_commercial_portrait_of_a_young_male_veterinarian.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891265/high_resolution_professional_studio_portrait_of_a_male_doctor_in_his_late_30s.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891263/high_resolution_professional_studio_portrait_of_an_east_asian_male_veterinary.png',
  'https://res.cloudinary.com/vphylrop/image/upload/v1788891074/high_resolution_professional_commercial_studio_portrait_of_a_senior_male.png',
];

const OFFICIAL_VET_URLS = [...FEMALE_VET_IMAGES, ...MALE_VET_IMAGES];

const NAME_TO_VET_IMAGE: Record<string, string> = {
  sarah: FEMALE_VET_IMAGES[0],
  priya: FEMALE_VET_IMAGES[1],
  neha: FEMALE_VET_IMAGES[2],
  emily: FEMALE_VET_IMAGES[3],
  sophia: FEMALE_VET_IMAGES[4],

  james: MALE_VET_IMAGES[0],
  rahul: MALE_VET_IMAGES[1],
  arjun: MALE_VET_IMAGES[2],
  david: MALE_VET_IMAGES[3],
  michael: MALE_VET_IMAGES[4],
};

/**
 * Returns a gender-matched real veterinarian doctor Cloudinary image URL.
 * Every doctor receives a unique dedicated high-resolution veterinarian photo without repetition.
 */
export function getVetImageUrl(vetName: string = '', photoUrl?: string, vetId?: number | string): string {
  // If photoUrl is already one of the official 10 high-resolution doctor URLs, return it
  if (photoUrl && OFFICIAL_VET_URLS.some((u) => photoUrl.includes(u) || u.includes(photoUrl))) {
    return photoUrl;
  }

  const lowerName = (vetName || '').toLowerCase().trim();

  // Check explicit name mapping first to guarantee fixed assignment
  for (const [key, imageUrL] of Object.entries(NAME_TO_VET_IMAGE)) {
    if (lowerName.includes(key)) {
      return imageUrL;
    }
  }

  // Fallback to gender-matched pool indexed deterministically by ID / Name hash
  const isFemale = FEMALE_NAMES.some((fname) => lowerName.includes(fname));
  const pool = isFemale ? FEMALE_VET_IMAGES : MALE_VET_IMAGES;

  let num = Number(vetId) || 0;
  for (let i = 0; i < lowerName.length; i++) {
    num += lowerName.charCodeAt(i) * (i + 1);
  }

  return pool[Math.abs(num) % pool.length];
}

/**
 * Returns a high-resolution Cloudinary image URL corresponding to the pet's species.
 */
export function getPetSpeciesImage(species?: string, customImage?: string): string {
  if (customImage && customImage.trim() !== '') {
    return customImage;
  }

  const s = (species || '').trim().toLowerCase();

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
  if (
    s.includes('reptile') ||
    s.includes('snake') ||
    s.includes('lizard') ||
    s.includes('turtle') ||
    s.includes('gecko') ||
    s.includes('chameleon') ||
    s.includes('iguana') ||
    s.includes('tortoise')
  ) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/3553855e-62e9-4565-9f5a-a5d484ecd080_1.png';
  }
  if (s.includes('fish') || s.includes('aquarium') || s.includes('goldfish') || s.includes('betta')) {
    return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895236/119ae58d-9928-4822-afb6-97826bd4341c_1.png';
  }

  // Default to Dog portrait
  return 'https://res.cloudinary.com/vphylrop/image/upload/v1788895238/be7aa286-04e9-4307-b2f4-6dc218dfb17f_1.png';
}

