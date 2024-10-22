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
  dueFranchise:Franchise[]; 
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
export interface MemberState {
  members: Member[];
  dueMembers:Member[];
  member: Member | null;
  loading: boolean;
  error: string | null;
}
export interface Member {
  memberId: string; // Unique member ID
  name: string; // Member name
  gender: "Male" | "Female" | "Other"; // Gender field
  dateOfBirth: Date; // Date of birth
  displayImage?: string; // Optional URL or path for display image

  // Contact Information
  address: string;
  city: string;
  state: string;
  zipCode: string; // Zip code
  phone: string; // Unique phone number
  email: string; // Unique email
  emergencyContactName: string; // Emergency contact name
  emergencyContactPhone: string; // Emergency contact phone

  // Physical Information
  weight: number; // Weight in kg
  height: number; // Height in cm
  fat?: number; // Optional body fat percentage
  arms?: number; // Optional arms measurement
  thigh?: number; // Optional thigh measurement
  waist?: number; // Optional waist measurement
  chest?: number; // Optional chest measurement

  // Membership Information
  membershipId: string; // Membership ID
  firstPaymentDate?: Date; // Optional first payment date
  assignedTrainer?: string; // Reference to assigned trainer (Trainer ID)

  // Gym and User Information
  gym: string; // Reference to gym (Gym ID)
  user?: string; // Optional reference to user (User ID)

  createdAt: Date; // Creation date (defaults to now)
}
export interface Workout {
  _id: string;
  workoutName: string;
  sets: string;
  reps: string;
  kg: string;
  restTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutState {
  workouts: Workout[];
  workout: Workout | null;
  loading: boolean;
  error: string | null;
}
export interface DietPlanState {
  dietPlans: DietPlan[];
  dietPlan: any;
  loading: boolean;
  error: string | null;
}
// Interface for individual meal details
interface MealDetails {
  selected: string | boolean; // Can be the name of the meal or false if not selected
  details?: string; // Optional field, only present if `selected` is not false
}

// Interface for a day's meals
export interface DayMeals {
  "Break Fast": MealDetails;
  "Mid-Morning Snacks": MealDetails;
  "Lunch": MealDetails;
  "Afternoon Snacks": MealDetails;
  "Dinner": MealDetails;
}

// Interface for the entire week's nutrition details
export interface NutritionDetails {
  Sunday: DayMeals;
  Monday: DayMeals;
  Tuesday: DayMeals;
  Wednesday: DayMeals;
  Thursday: DayMeals;
  Friday: DayMeals;
  Saturday: DayMeals;
}

// Interface for the entire diet plan
export interface DietPlan {
  nutritionDetails: NutritionDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

