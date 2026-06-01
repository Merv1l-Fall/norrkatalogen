import { create } from "zustand";
import {
  getCompanies,
  addCompany as firestoreAddCompany,
  updateCompany as firestoreUpdateCompany,
} from "@/data/crud";
import type { Company, CompanyStoreState, NewCompanyFormData } from "@/types";

const useCompanyStore = create<CompanyStoreState>((set) => ({
  companies: [],
  loading: true,

  // Filter state
  searchTerm: "",
  selectedVehicles: [],
  hideCalled: false,
  showWithNotesOnly: false,

  setSearchTerm: (term: string): void => set({ searchTerm: term }),
  setSelectedVehicles: (vehicles: string[]): void =>
    set({ selectedVehicles: Array.isArray(vehicles) ? vehicles : [] }),
  setHideCalled: (val: boolean): void => set({ hideCalled: val }),
  setShowWithNotesOnly: (val: boolean): void =>
    set({ showWithNotesOnly: val }),

  fetchCompanies: async (): Promise<void> => {
    set({ loading: true });
    try {
      const companies = await getCompanies();
      set({ companies, loading: false });
      console.log("Companies fetched:", companies.length);
    } catch (error) {
      console.error("Error fetching companies:", error);
      set({ loading: false });
    }
  },

  AddCompany: async (newCompanyData: NewCompanyFormData): Promise<string> => {
    try {
      const docId = await firestoreAddCompany(newCompanyData);
      set((state) => ({
        companies: [
          ...state.companies,
          { id: docId, ...newCompanyData } as Company,
        ],
      }));
      console.log("Company added:", docId);
      return docId;
    } catch (error) {
      console.error("Error adding company:", error);
      throw error;
    }
  },

  UpdateCompany: async (
    id: string,
    updatedData: Partial<Company>
  ): Promise<void> => {
    try {
      await firestoreUpdateCompany(id, updatedData);
      set((state) => ({
        companies: state.companies.map((company) =>
          company.id === id ? { ...company, ...updatedData } : company
        ),
      }));
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  },

  updateCompanyLocally: (updatedCompany: Company): void =>
    set((state) => ({
      companies: state.companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      ),
    })),
}));

export default useCompanyStore;
