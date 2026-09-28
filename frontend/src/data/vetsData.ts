import { getVetImageUrl } from '../lib/utils';

export type PetType = 'dogs' | 'cats' | 'birds' | 'rabbits' | 'exotic';
export type AvailabilityStatus = 'available' | 'busy' | 'offline';

export interface VetData {
  id: number | string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  fee: number;
  image: string;
  petTypes: PetType[];
  availability: AvailabilityStatus;
  nextSlot?: string;
  rating?: number;
  reviewsCount?: number;
}

export const initialVetsData: VetData[] = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'Small Animal Specialist',
    subSpecialty: 'Canine & Feline Nutrition, Dermatology',
    experienceYears: 8,
    fee: 700,
    image: getVetImageUrl('Dr. Priya Sharma', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['dogs', 'cats', 'rabbits'],
    availability: 'available',
  },
  {
    id: 2,
    name: 'Dr. Rajesh Nair',
    specialty: 'Avian & Exotic Pet Care',
    subSpecialty: 'Avian Medicine, Reptiles & Small Mammals',
    experienceYears: 12,
    fee: 850,
    image: getVetImageUrl('Dr. Rajesh Nair', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['birds', 'exotic', 'rabbits'],
    availability: 'available',
  },
  {
    id: 3,
    name: 'Dr. Ananya Roy',
    specialty: 'Veterinary Surgeon',
    subSpecialty: 'Orthopedic & Soft Tissue Surgery',
    experienceYears: 10,
    fee: 900,
    image: getVetImageUrl('Dr. Ananya Roy', 'https://images.unsplash.com/photo-1594824813681-ec0d38102377?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
  {
    id: 4,
    name: 'Dr. Vikram Sethi',
    specialty: 'Feline Medicine Specialist',
    subSpecialty: 'Internal Medicine, Behavior & Geriatric Care',
    experienceYears: 7,
    fee: 650,
    image: getVetImageUrl('Dr. Vikram Sethi', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['cats', 'rabbits'],
    availability: 'available',
  },
  {
    id: 5,
    name: 'Dr. Meera Patel',
    specialty: 'Dermatology & Allergies',
    subSpecialty: 'Skin Diagnostics, Chronic Allergy Plans',
    experienceYears: 9,
    fee: 750,
    image: getVetImageUrl('Dr. Meera Patel', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['dogs', 'cats', 'exotic'],
    availability: 'available',
  },
  {
    id: 6,
    name: 'Dr. Karan Varma',
    specialty: 'Exotic Mammals & Birds',
    subSpecialty: 'Dental Health, Beak & Feather Disease',
    experienceYears: 6,
    fee: 700,
    image: getVetImageUrl('Dr. Karan Varma', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600'),
    petTypes: ['birds', 'rabbits', 'exotic'],
    availability: 'available',
  },
];
