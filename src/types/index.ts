// Shared type definitions for the application

/** Company vehicle type */
export interface CompanyVehicles {
  grusbil?: boolean;
  godsbil?: boolean;
  timmerbil?: boolean;
  bulkbil?: boolean;
  väghyvel?: boolean;
  hjullastare?: boolean;
  baklastare?: boolean;
  kranbil?: boolean;
  flisbil?: boolean;
  dumper?: boolean;
  skogsmaskin?: boolean;
  grävare?: boolean;
  maskintrailer?: boolean;
  flakvaxlare?: boolean;
  trailerdragare?: boolean;
  asfalstrailer?: boolean;
  [key: string]: boolean | undefined;
}

/** Company data model */
export interface Company {
  id: string;
  companyName: string;
  address: string;
  city: string;
  postalCode: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  vehicles: CompanyVehicles;
  notes?: string;
  called?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Login form data */
export interface LoginFormData {
  email: string;
  password: string;
}

/** New company form data */
export interface NewCompanyFormData {
  companyName: string;
  address: string;
  city: string;
  postalCode: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  vehicles: CompanyVehicles;
  notes?: string;
}

/** Firebase User type */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata?: {
    createdAt: string;
    lastSignInTime: string;
  };
  providerData: Array<{
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
  }>;
  toJSON?: () => Record<string, unknown>;
}

/** Auth store state */
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logOut: () => Promise<void>;
}

/** Company store state */
export interface CompanyStoreState {
  companies: Company[];
  loading: boolean;
  searchTerm: string;
  selectedVehicles: string[];
  hideCalled: boolean;
  showWithNotesOnly: boolean;
  setSearchTerm: (term: string) => void;
  setSelectedVehicles: (vehicles: string[]) => void;
  setHideCalled: (val: boolean) => void;
  setShowWithNotesOnly: (val: boolean) => void;
  fetchCompanies: () => Promise<void>;
  AddCompany: (data: NewCompanyFormData) => Promise<string>;
  UpdateCompany: (id: string, data: Partial<Company>) => Promise<void>;
  updateCompanyLocally: (company: Company) => void;
}

/** API response types */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Export data format for Excel */
export interface ExportData {
  "Företagsnamn": string;
  "Adress": string;
  "Postnummer": string;
  "Stad": string;
  "Kontaktperson": string;
  "Telefon": string;
  "Noteringar": string;
  "Fordon": string;
}
