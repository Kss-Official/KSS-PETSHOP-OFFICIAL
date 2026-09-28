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
    name: 'Dr. Sarah Mitchell',
    specialty: 'Surgery',
    subSpecialty: 'Veterinary Surgeon',
    experienceYears: 12,
    fee: 700,
    image: getVetImageUrl('Dr. Sarah Mitchell'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
  {
    id: 2,
    name: 'Dr. James Carter',
    specialty: 'Surgery',
    subSpecialty: 'Orthopaedic Surgeon',
    experienceYears: 10,
    fee: 700,
    image: getVetImageUrl('Dr. James Carter'),
    petTypes: ['dogs', 'cats', 'rabbits'],
    availability: 'available',
  },
  {
    id: 3,
    name: 'Dr. Rahul Sharma',
    specialty: 'General Veterinarian',
    subSpecialty: 'Preventive & Wellness Care',
    experienceYears: 8,
    fee: 700,
    image: getVetImageUrl('Dr. Rahul Sharma'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
  {
    id: 4,
    name: 'Dr. Priya Mehta',
    specialty: 'Dental Care',
    subSpecialty: 'Oral Surgery & Prophylaxis',
    experienceYears: 9,
    fee: 700,
    image: getVetImageUrl('Dr. Priya Mehta'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
  {
    id: 5,
    name: 'Dr. Arjun Verma',
    specialty: 'Exotic Pet Care',
    subSpecialty: 'Small Mammal & Reptile Specialist',
    experienceYears: 7,
    fee: 600,
    image: getVetImageUrl('Dr. Arjun Verma'),
    petTypes: ['rabbits', 'exotic'],
    availability: 'available',
  },
  {
    id: 6,
    name: 'Dr. Neha Kapoor',
    specialty: 'Exotic Pet Care',
    subSpecialty: 'Avian & Bird Medicine',
    experienceYears: 6,
    fee: 600,
    image: getVetImageUrl('Dr. Neha Kapoor'),
    petTypes: ['birds', 'exotic'],
    availability: 'available',
  },
  {
    id: 7,
    name: 'Dr. David Chen',
    specialty: 'Dermatology',
    subSpecialty: 'Allergy & Skin Therapeutics',
    experienceYears: 11,
    fee: 700,
    image: getVetImageUrl('Dr. David Chen'),
    petTypes: ['dogs', 'cats', 'rabbits'],
    availability: 'available',
  },
  {
    id: 8,
    name: 'Dr. Emily Watson',
    specialty: 'Emergency Care',
    subSpecialty: 'Critical Care & Triage',
    experienceYears: 14,
    fee: 700,
    image: getVetImageUrl('Dr. Emily Watson'),
    petTypes: ['dogs', 'cats', 'birds', 'rabbits', 'exotic'],
    availability: 'available',
  },
  {
    id: 9,
    name: 'Dr. Michael Roberts',
    specialty: 'Cardiology',
    subSpecialty: 'Cardiovascular Diagnostics',
    experienceYears: 15,
    fee: 700,
    image: getVetImageUrl('Dr. Michael Roberts'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
  {
    id: 10,
    name: 'Dr. Sophia Martinez',
    specialty: 'Oncology',
    subSpecialty: 'Medical Oncology & Chemotherapy',
    experienceYears: 13,
    fee: 700,
    image: getVetImageUrl('Dr. Sophia Martinez'),
    petTypes: ['dogs', 'cats'],
    availability: 'available',
  },
];
