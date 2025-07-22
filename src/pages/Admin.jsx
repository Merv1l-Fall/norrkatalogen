import Filter from "../components/Filter";
import CompanyCard from "../components/CompanyCard";
import useCompanyStore from "../stores/companyStore.js";
import { useMemo } from "react";
import exportToExcel from "../utils/export.js";
import { FixedSizeList as List } from "react-window";
import "../css/Admin.css";

const Admin = () => {
	const companies = useCompanyStore((state) => state.companies);
	const searchTerm = useCompanyStore((state) => state.searchTerm);
	const hideCalled = useCompanyStore((state) => state.hideCalled);
	const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);
	const loading = useCompanyStore((state) => state.loading);
	const showWithNotesOnly = useCompanyStore((state) => state.showWithNotesOnly);

	const normalize = (str) =>
		str
			?.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") || "";

	const normalizedSearchTerm = normalize(searchTerm);

	const filteredCompanies = useMemo(() => {
		console.log("Filtering companies (should not log on every render!)");
		const vehicles = Array.isArray(selectedVehicles)
			? selectedVehicles
			: [];
		return companies.filter((company) => {
			if (hideCalled && company.called) return false;
			if (showWithNotesOnly && (!company.notes || company.notes.trim() === "")) return false;
			

			const companyName = normalize(company.companyName);
			if (!companyName.includes(normalizedSearchTerm)) return false;
			

			if (vehicles.length > 0) {
				return vehicles.some(
					(v) => company.vehicles?.[v.toLowerCase()] === true
				);
			}
			

			return true;
		});
	}, [companies, hideCalled, normalizedSearchTerm, selectedVehicles, showWithNotesOnly]);

	const sortedCompanies = useMemo(() => {
		return [...filteredCompanies].sort((a, b) => {
			const nameA = a.companyName.toLowerCase();
			const nameB = b.companyName.toLowerCase();
			return nameA.localeCompare(nameB);
		});
	}, [filteredCompanies]);

	return (
		<main className="admin-page">
			<button className="export-btn" onClick={() => exportToExcel(sortedCompanies)}>
				Exportera till Excel
			</button>
			<Filter />

			<div className="company-list">
	{loading ? (
		<p className="loading-text">Laddar</p>
	) : sortedCompanies.length === 0 ? (
		<p className="no-companies">Inga företag hittades</p>
	) : (
		<List
			height={window.innerHeight} // or dynamically from window.innerHeight
			itemCount={sortedCompanies.length}
			itemSize={250} // Adjust based on your card height
			width={"100%"}
		>
			{({ index, style }) => (
				<div style={style}>
					<CompanyCard company={sortedCompanies[index]} />
				</div>
			)}
		</List>
	)}
</div>
		</main>
	);
};

export default Admin;
