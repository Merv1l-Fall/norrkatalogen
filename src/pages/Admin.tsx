import { useMemo, type CSSProperties, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import Filter from "@/components/Filter";
import CompanyCard from "@/components/CompanyCard";
import useCompanyStore from "@/stores/companyStore";
import exportToExcel from "@/utils/export";
import "@/css/Admin.css";
import "@/css/Animation.css";

const Admin = (): ReactElement => {
	const companies = useCompanyStore((state) => state.companies);
	const searchTerm = useCompanyStore((state) => state.searchTerm);
	const hideCalled = useCompanyStore((state) => state.hideCalled);
	const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);
	const loading = useCompanyStore((state) => state.loading);
	const showWithNotesOnly = useCompanyStore((state) => state.showWithNotesOnly);

	const navigate = useNavigate();

	const normalize = (str: string | undefined): string =>
		str
			?.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "") ?? "";

	const normalizedSearchTerm = normalize(searchTerm);

	const filteredCompanies = useMemo(() => {
		console.log("Filtering companies (should not log on every render!)");
		const vehicles = Array.isArray(selectedVehicles) ? selectedVehicles : [];

		return companies.filter((company) => {
			if (hideCalled && company.called) return false;
			if (showWithNotesOnly && (!company.notes || company.notes.trim() === "")) return false;

			const companyName = normalize(company.companyName);
			if (!companyName.includes(normalizedSearchTerm)) return false;

			if (vehicles.length > 0) {
				return vehicles.some(
					(v) => company.vehicles?.[v.toLowerCase() as keyof typeof company.vehicles] === true
				);
			}

			return true;
		});
	}, [companies, hideCalled, normalizedSearchTerm, selectedVehicles, showWithNotesOnly]);

	const sortedCompanies = [...filteredCompanies].sort((a, b) => {
		const nameA = a.companyName.toLowerCase();
		const nameB = b.companyName.toLowerCase();
		return nameA.localeCompare(nameB);
	});

	const Row = ({ index, style }: { index: number; style: CSSProperties }): ReactElement => (
		<div style={style}>
			<CompanyCard company={sortedCompanies[index]} />
		</div>
	);

	return (
		<main className="admin-page">
			<div className="admin-btn-container">
				<button 
					className="admin-top-btn" 
					onClick={() => exportToExcel(sortedCompanies)}
				>
					Exportera till Excel
				</button>
				<button 
					className="admin-top-btn" 
					onClick={() => navigate("/nytt-foretag")}
				>
					Lägg till nytt företag
				</button>
			</div>
			<Filter />

			<div className="company-list">
				{loading ? (
					<p className="loading-text">Laddar</p>
				) : sortedCompanies.length === 0 ? (
					<p className="no-companies">Inga företag hittades</p>
				) : (
					<List
						className="display-list"
						height={window.innerHeight}
						itemCount={sortedCompanies.length}
						itemSize={300}
						width="100%"
					>
						{Row}
					</List>
				)}
			</div>
		</main>
	);
};

export default Admin;
