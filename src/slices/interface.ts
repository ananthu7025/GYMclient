export interface FranchiseAdmin {
  id: string; 
  name: string; 
  email: string; 
  password: string; 
  role: number; 
}

export interface Franchise {
  _id: string; 
  name: string; 
  franchiseAdmin: FranchiseAdmin; 
  address: string; 
  city: string; 
  state: string; 
  zipCode: string; 
  country: string; 
  phone: string; 
  email: string; 
  website: string; 
  establishedYear: number; 
  numberOfGyms: number; 
  description: string; 
  logo: string;
  status: number; 
  createdAt: string; 
  updatedAt: string;
}

export interface FranchiseState {
  franchises: Franchise[]; 
  loading: boolean; 
  error: string | null; 
  franchise: any;
}
export interface GymAdmin {
  id: string;
  name: string; 
  email: string; 
  password: string;
  role: number;
}

export interface Gym {
  _id: string; 
  name: string; 
  gymAdminData: GymAdmin; 
  franchiseId: string; 
  openingHours: string; 
  closingHours: string; 
  address: string;
  city: string;
  state: string; 
  zipCode: string; 
  country: string; 
  phone: string;
  email: string; 
  website: string; 
  logo: string; 
  createdAt: string; 
  updatedAt: string; 
}

export interface GymState {
  gyms: Gym[]; 
  loading: boolean; 
  error: string | null; 
  gym: Gym | null; 
}
export interface MembershipState {
  memberships: Membership[]; 
  loading: boolean; 
  error: string | null; 
  membership: Membership | null; 
  suggestion:Membership[]
}
export interface Membership {
  _id?: string;
  name: string;
  period: string;
  amount: number;
  signupFee: number;
  description: string;
  image?: string;
  gymId: string; 
  franchiseId?: string; 
  createdAt?: Date; 
  updatedAt?: Date;
}
export interface Trainer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: number; // 0 = regular, 1 = senior, etc.
  specialization: string;
  experience: number; // in years
  gymId: string; 
  franchiseId?: string;
  status: number; // 1 = active, 0 = inactive
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrainerState {
  trainers: Trainer[];
  trainer: Trainer | null;
  loading: boolean;
  error: string | null;
}
