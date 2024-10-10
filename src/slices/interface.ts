// Define the interface for FranchiseAdmin
export interface FranchiseAdmin {
  id: string; // The admin ID
  name: string; // The admin's name
  email: string; // The admin's email
  password: string; // The admin's password (if needed)
  role: number; // The admin's role
}

export interface Franchise {
  _id: string; // Franchise ID
  name: string; // Franchise name
  franchiseAdmin: FranchiseAdmin; // Admin details associated with the franchise
  address: string; // Address of the franchise
  city: string; // City where the franchise is located
  state: string; // State where the franchise is located
  zipCode: string; // Zip code of the franchise
  country: string; // Country where the franchise is located
  phone: string; // Phone number of the franchise
  email: string; // Email address of the franchise
  website: string; // Website URL of the franchise
  establishedYear: number; // Year the franchise was established
  numberOfGyms: number; // Number of gyms under the franchise
  description: string; // Description of the franchise
  logo: string; // Logo image in base64 format
  status: number; // Status of the franchise (e.g., active, inactive)
  createdAt: string; // Creation timestamp
  updatedAt: string; // Update timestamp
}

// Define the initial state for franchises
export interface FranchiseState {
  franchises: Franchise[]; // Array of franchises
  loading: boolean; // Loading state
  error: string | null; // Error state
  franchise: any;
}
