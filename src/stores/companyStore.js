import { create } from "zustand";
import {
	getCompanies,
	addCompany as firestoreAddCompany,
	updateCompany as firestoreUpdateCompany,
} from "../data/crud";

const useCompanyStore = create((set) => ({
	companies: [],
	loading: true,

	// Filter state
	searchTerm: "",
	selectedVehicles: [],
	hideCalled: false,
	showWithNotesOnly: false,

	setSearchTerm: (term) => set({ searchTerm: term }),
	setSelectedVehicles: (vehicles) =>
		set({ selectedVehicles: Array.isArray(vehicles) ? vehicles : [] }),
	setHideCalled: (val) => set({ hideCalled: val }),
	setShowWithNotesOnly: (val) => set({ showWithNotesOnly: val }),

	fetchCompanies: async () => {
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

	AddCompany: async (newCompanyData) => {
		try {
			const docId = await firestoreAddCompany(newCompanyData);
			set((state) => ({
				companies: [
					...state.companies,
					{ id: docId, ...newCompanyData },
				],
			}));
			return docId;
		} catch (error) {
			console.error("Error adding company:", error);
			throw error;
		}
	},

	UpdateCompany: async (id, updatedData) => {
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
}));

export default useCompanyStore;
