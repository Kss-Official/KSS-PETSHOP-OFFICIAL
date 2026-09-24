export type PetType = 'DOG' | 'CAT' | 'SMALL_PET';
export type SmallPetSpecies = 'HAMSTER' | 'BIRD' | 'RABBIT' | 'FISH' | 'REPTILE';

export interface CategoryGroup {
  name: string;
  subcategories: string[];
}

export const DOG_TAXONOMY: CategoryGroup[] = [
  {
    name: 'FOOD',
    subcategories: [
      'Dry Food',
      'Wet Food',
      'Puppy Food',
      'Adult Food',
      'Senior Food',
      'Grain-Free Food',
      'Specialty Food',
    ],
  },
  {
    name: 'TREATS',
    subcategories: [
      'Training Treats',
      'Dental Treats',
      'Jerky Treats',
      'Crunchy Treats',
      'Soft Treats',
      'Puppy Treats',
    ],
  },
  {
    name: 'TOYS',
    subcategories: [
      'Chew Toys',
      'Fetch Toys',
      'Rope Toys',
      'Puzzle Toys',
      'Plush Toys',
      'Interactive Toys',
    ],
  },
  {
    name: 'WALK & TRAVEL',
    subcategories: [
      'Collars',
      'Leashes',
      'Harnesses',
      'GPS Trackers',
      'Carriers',
      'Travel Bowls',
      'Car Safety',
    ],
  },
  {
    name: 'CLOTHING & ACCESSORIES',
    subcategories: [
      'Jackets',
      'Raincoats',
      'Bandanas',
      'Bowties',
      'Boots',
      'Cooling Accessories',
    ],
  },
  {
    name: 'BOWLS & FEEDERS',
    subcategories: [
      'Steel Bowls',
      'Ceramic Bowls',
      'Plastic Bowls',
      'Slow Feeders',
      'Automatic Feeders',
      'Water Dispensers',
    ],
  },
  {
    name: 'GROOMING',
    subcategories: [
      'Shampoos',
      'Conditioners',
      'Brushes & Combs',
      'De-shedding Tools',
      'Nail Clippers',
      'Grooming Kits',
      'Towels & Wipes',
    ],
  },
  {
    name: 'BEDS & HOUSING',
    subcategories: [
      'Beds',
      'Mats',
      'Cooling Mats',
      'Blankets',
      'Crates',
      'Kennels',
      'Dog Houses',
    ],
  },
  {
    name: 'HEALTH & WELLNESS',
    subcategories: [
      'Supplements',
      'Dental Care',
      'Joint Support',
      'Calming Aids',
      'Skin & Coat Care',
    ],
  },
];

export const CAT_TAXONOMY: CategoryGroup[] = [
  {
    name: 'CAT FOOD',
    subcategories: [
      'Dry Food',
      'Wet Food',
      'Kitten Food',
      'Adult Food',
      'Senior Food',
      'Grain-Free Food',
      'Premium Food',
    ],
  },
  {
    name: 'CAT TREATS',
    subcategories: [
      'Creamy Treats',
      'Crunchy Treats',
      'Jerky Treats',
      'Dental Treats',
      'Healthy Treats',
      'Training Treats',
    ],
  },
  {
    name: 'CAT LITTER SUPPLIES',
    subcategories: [
      'Cat Litter',
      'Litter Boxes',
      'Litter Trays',
      'Scoopers',
      'Waste Disposal',
      'Litter Mats',
      'Scented Litter',
      'Unscented Litter',
      'Flushable Litter',
      'Litter Deodorizers',
    ],
  },
  {
    name: 'CAT TOYS',
    subcategories: [
      'Cat Teasers',
      'Ball & Chaser Toys',
      'Catnip Toys',
      'Plush Toys',
      'Cat Trees',
      'Scratchers',
      'Interactive Toys',
      'Smart Toys',
    ],
  },
  {
    name: 'CAT WALK & TRAVEL',
    subcategories: [
      'Collars',
      'Harnesses',
      'Leashes',
      'GPS Trackers',
      'Carriers',
      'Travel Accessories',
      'Bells & Tags',
    ],
  },
  {
    name: 'CAT CLOTHING & ACCESSORIES',
    subcategories: [
      'Dresses',
      'Tshirts & Shirts',
      'Kurtas',
      'Lehengas',
      'Jackets & Sweaters',
      'Hoodies',
      'Bandanas & Bowties',
      'Raincoats',
    ],
  },
  {
    name: 'BOWLS & FEEDERS',
    subcategories: [
      'Water Fountains',
      'Food & Water Dispensers',
      'Steel Bowls',
      'Ceramic Bowls',
      'Printed Bowls',
      'Plastic Bowls',
      'Slow Feeders',
    ],
  },
  {
    name: 'CAT GROOMING',
    subcategories: [
      'Shampoos & Conditioners',
      'Brushes & Combs',
      'Paw & Nail Care',
      'Ear & Eye Care',
      'Trimmers & Nail Clippers',
      'Grooming Tools',
      'Towels & Wipes',
      'Deodorizers',
    ],
  },
  {
    name: 'BEDS, MATS & HOUSING',
    subcategories: [
      'Beds',
      'Mats',
      'Cooling Mats',
      'Blankets & Cushions',
      'Cat Houses',
      'Cat Trees',
      'Condos',
      'Scratchers',
    ],
  },
  {
    name: 'HEALTH & WELLNESS',
    subcategories: [
      'Supplements',
      'Dental Care',
      'Calming Aids',
      'Skin & Coat Care',
    ],
  },
];

export const SMALL_PETS_TAXONOMY: Record<SmallPetSpecies, CategoryGroup[]> = {
  HAMSTER: [
    {
      name: 'HAMSTERS',
      subcategories: [
        'Hamster Food',
        'Wheels & Exercise Ball',
        'Water Bottles & Feeders',
        'Hamster Treats',
        'Grooming & Cleaning',
        'Hamster Habitat',
      ],
    },
  ],
  BIRD: [
    {
      name: 'BIRDS',
      subcategories: [
        'Bird Food',
        'Bird Supplements',
        'Feeders & Waterers',
        'Perches',
        'Bird Toys',
        'Grooming',
        'Cleaning Supplies',
      ],
    },
  ],
  RABBIT: [
    {
      name: 'RABBIT',
      subcategories: [
        'Rabbit Food',
        'Rabbit Treats',
        'Supplements',
        'Bottles & Feeders',
        'Grooming & Cleaning',
      ],
    },
  ],
  FISH: [
    {
      name: 'FISH',
      subcategories: [
        'Fish Food',
        'Fish Treats',
        'Water Care',
        'Filters & Media',
        'Aquarium Decors',
        'Gravel & Sand',
        'Cleaners & Accessories',
      ],
    },
  ],
  REPTILE: [
    {
      name: 'GUINEA PIGS & REPTILES',
      subcategories: [
        'Guinea Pig Food',
        'Supplements',
        'Guinea Pig Treats',
        'Reptile Food',
        'Terrariums & Habitats',
        'Heating & Lighting',
      ],
    },
  ],
};

export const SMALL_PET_SPECIES_LIST: { id: SmallPetSpecies; name: string; emoji: string; desc: string }[] = [
  { id: 'HAMSTER', name: 'Hamsters', emoji: '🐹', desc: 'Bedding, wheels & nutritious mixes' },
  { id: 'BIRD', name: 'Birds', emoji: '🐦', desc: 'Seeds, perches & stimulating toys' },
  { id: 'RABBIT', name: 'Rabbits', emoji: '🐰', desc: 'Timothy hay, hutches & chew tunnels' },
  { id: 'FISH', name: 'Fish', emoji: '🐠', desc: 'Tanks, filtration & water care' },
  { id: 'REPTILE', name: 'Reptiles & Guinea Pigs', emoji: '🦎', desc: 'Terrariums, heat lamps & live feeds' },
];
