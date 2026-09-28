export interface ArticleDto {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  petType?: string;
  imageUrl?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  isFeatured?: boolean;
}

export const FALLBACK_ARTICLES: ArticleDto[] = [
  {
    id: 1,
    title: 'Essential Nutrition Guide: Fueling Your Pet for Every Stage of Life',
    excerpt:
      'Explore veterinary insights on macronutrient balances, life-stage feeding guidelines, and avoiding toxic household foods for dogs and cats.',
    content: `Proper nutrition is the cornerstone of lifelong pet health. Whether you are caring for a rambunctious puppy, an agile feline explorer, or a dignified senior dog, matching calorie density and nutrient distribution to life stages makes a monumental difference in vitality, immunity, and longevity.

### 1. Understanding Macronutrient Needs
Canines thrive on high-quality animal proteins combined with digestible fats and complex carbohydrates. Felines, as obligate carnivores, require higher dietary protein with essential amino acids like taurine and arachidonic acid, which their bodies cannot synthesize independently.

### 2. Tailoring to Life Stages
- **Puppies & Kittens:** Need concentrated caloric intake and optimal Calcium-to-Phosphorus ratios for bone density and brain development.
- **Adult Pets:** Focus on weight management, lean muscle retention, and dental hygiene support through textured kibble or dental treats.
- **Senior Companions:** Require reduced sodium, elevated joint support agents (glucosamine, chondroitin, and omega-3 EPA/DHA), and easily digestible protein sources to protect kidneys.

### 3. Dangerous Foods to Strictly Avoid
Never feed chocolate, xylitol (artificial sweetener), onions, garlic, grapes, raisins, macadamia nuts, or cooked animal bones, which can splinter and cause gastrointestinal perforation.`,
    category: 'Nutrition',
    petType: 'Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    readTimeMinutes: 4,
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Core Vaccination Schedules & Disease Prevention for Dogs and Cats',
    excerpt:
      'Understanding rabies, DHPP, FVRCP vaccines and why timely booster shots are the gold standard for long-term immunological defense.',
    content: `Vaccines stand as one of modern veterinary medicine's greatest achievements, safeguarding pets against debilitating and frequently fatal viral infections.

### Core vs. Non-Core Vaccines
- **Dogs Core:** Rabies, Canine Distemper, Adenovirus, Parvovirus (DHPP).
- **Dogs Non-Core:** Bordetella (kennel cough), Leptospirosis, Lyme disease, and Canine Influenza based on regional lifestyle risks.
- **Cats Core:** Rabies, Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia (FVRCP).
- **Cats Non-Core:** Feline Leukemia (FeLV), especially critical for indoor/outdoor cats.

### Recommended Timing
Primary series begin between 6 to 8 weeks of age, followed by boosters every 3 to 4 weeks until roughly 16 weeks. Lifelong immunity is maintained with booster shots administered every 1 to 3 years depending on local veterinary protocols.`,
    category: 'Vaccination',
    petType: 'Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    readTimeMinutes: 3,
    isFeatured: false,
  },
  {
    id: 3,
    title: 'Stress-Free Home Grooming: Coat, Ear, and Claw Maintenance',
    excerpt:
      'Step-by-step techniques to de-shed double coats, clean ears safely, and trim nails without clipping into the sensitive quick.',
    content: `Routine grooming is not just about keeping your companion looking sharp—it is an indispensable health check that allows you to detect skin abnormalities, parasites, and ear infections early.

### 1. Brushing & Coat Health
Brush double-coated breeds (like Golden Retrievers or Huskies) with an undercoat rake 2-3 times weekly to remove dead hair and prevent matting. Never shave double coats, as the undercoat regulates temperature against both cold and heat.

### 2. Nail Care Techniques
Trim claws with sharp guillotine or scissor clippers, cutting only the translucent tip parallel to the pad. Always keep styptic powder or cornstarch handy in case you accidentally graze the quick.

### 3. Safe Ear Cleaning
Use a vet-approved enzymatic ear rinse. Fill the canal, massage the base of the ear for 30 seconds to dissolve cerumen, and wipe clean with cotton pads—never insert cotton swabs deep into the ear canal.`,
    category: 'Grooming',
    petType: 'Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    readTimeMinutes: 4,
    isFeatured: false,
  },
  {
    id: 4,
    title: 'Year-Round Parasite Control: Fleas, Ticks, and Heartworms',
    excerpt:
      'Why monthly preventive treatments are mandatory even during colder seasons and for indoor pets.',
    content: `Parasites pose severe health hazards not just to animals, but to human family members via zoonotic transmission.

### 1. Heartworm Prevention
Heartworms are transmitted by mosquitoes and develop inside the pulmonary arterial system. Prevention through monthly oral chews or topical applications is safe, effective, and infinitely less risky than treating mature infestations.

### 2. Fleas and Ticks
Ticks transmit Lyme disease, Ehrlichiosis, and Anaplasmosis, while fleas cause severe allergic dermatitis and transmit tapeworms. Modern isoxazoline oral tablets or topical spot-ons provide continuous, 30-to-90-day systemic protection.`,
    category: 'Preventive Care',
    petType: 'Cats',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    readTimeMinutes: 3,
    isFeatured: false,
  },
  {
    id: 5,
    title: 'Decoding Cat Body Language: Purrs, Tail Twitches, and Slow Blinks',
    excerpt:
      'Learn how to read feline vocalizations and subtle micro-signals to strengthen trust and alleviate environmental anxiety.',
    content: `Cats communicate complex emotional states through subtle postural signals that owners frequently misinterpret.

### Understanding Tail Movements
- **Upright with curved tip:** Friendly, confident greeting.
- **Puffed bottle-brush:** Severe fear or aggressive defensiveness.
- **Low twitching or thumping:** Frustration or overstimulation; cease petting immediately.

### The Power of the Slow Blink
When your cat looks into your eyes and slowly closes their eyelids, they are conveying deep safety and emotional trust. Returning a slow, gentle blink reinforces that bond.`,
    category: 'Behaviour',
    petType: 'Cats',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    readTimeMinutes: 3,
    isFeatured: false,
  },
  {
    id: 6,
    title: 'Senior Pet Care: Comfort, Mobility, and Cognitive Health',
    excerpt:
      'Practical home adaptations and nutritional adjustments to support aging pets through arthritis and cognitive changes.',
    content: `As pets enter their golden years, proactive veterinary monitoring and domestic modifications ensure their comfort and dignity.

### 1. Joint Mobility Support
Install non-slip rugs over polished hardwood floors, provide orthopedic memory foam beds, and offer pet ramps for vehicle access or furniture.

### 2. Biannual Veterinary Checkups
Senior pets age roughly 4-5 times faster than humans. Biannual exams with comprehensive blood and urine panels catch kidney insufficiency, diabetes, and endocrine conditions before clinical symptoms escalate.`,
    category: 'Senior Pet Care',
    petType: 'Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db98a1e?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    readTimeMinutes: 4,
    isFeatured: false,
  },
  {
    id: 7,
    title: 'Emergency Pet First Aid: Recognizing Red Flags and Critical Signs',
    excerpt:
      'Crucial warning signs that demand immediate 24/7 veterinary triage—from bloat and respiratory distress to pale gums.',
    content: `Knowing when an issue is an emergency saves precious minutes in critical medical scenarios.

### Immediate Red Flags:
1. **Unproductive Retching & Distended Abdomen:** High risk of Gastric Dilatation-Volvulus (GDV/Bloat) in large dogs—requires immediate surgical intervention.
2. **Open-Mouth Breathing in Cats:** Cats rarely pant from exertion; this indicates acute respiratory distress or pulmonary edema.
3. **Pale or Blue Gums:** Indicates shock, internal hemorrhage, or severe hypoxemia.
4. **Sudden Inability to Urinate:** Especially in male cats, urethral obstruction is a life-threatening medical emergency within 24 hours.`,
    category: 'Emergency Care',
    petType: 'Dogs',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1000&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    readTimeMinutes: 4,
    isFeatured: false,
  },
];
