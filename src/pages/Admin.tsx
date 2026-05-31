import { useEffect, useMemo, useState, type ReactElement } from "react";
import Filter from "@/components/Filter";
import CompanyCard from "@/components/CompanyCard";
import AdminTablePanel from "../components/AdminTablePanel";
import useCompanyStore from "@/stores/companyStore";
import type { Company } from "@/types";
import "@/css/Admin.css";
import "@/css/Animation.css";

const ROW_BATCH_SIZE = 30;

const Admin = (): ReactElement => {
	const companies = useCompanyStore((state) => state.companies);
	const searchTerm = useCompanyStore((state) => state.searchTerm);
	const hideCalled = useCompanyStore((state) => state.hideCalled);
	const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);
	const loading = useCompanyStore((state) => state.loading);
	const showWithNotesOnly = useCompanyStore((state) => state.showWithNotesOnly);

	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [visibleRowCount, setVisibleRowCount] = useState(ROW_BATCH_SIZE);

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

	const sortedCompanies = useMemo(
		() =>
			[...filteredCompanies].sort((a, b) => {
				const nameA = a.companyName.toLowerCase();
				const nameB = b.companyName.toLowerCase();
				return nameA.localeCompare(nameB);
			}),
		[filteredCompanies]
	);

	const visibleCompanies = useMemo(
		() => (normalizedSearchTerm ? sortedCompanies : sortedCompanies.slice(0, visibleRowCount)),
		[normalizedSearchTerm, sortedCompanies, visibleRowCount]
	);
	const isSearchActive = normalizedSearchTerm.length > 0;

	useEffect(() => {
		if (!sortedCompanies.length) {
			setSelectedCompany(null);
			setVisibleRowCount(ROW_BATCH_SIZE);
			return;
		}

		setVisibleRowCount(ROW_BATCH_SIZE);
	}, [sortedCompanies]);

	useEffect(() => {
		if (selectedCompany && !sortedCompanies.some((company) => company.id === selectedCompany.id)) {
			setSelectedCompany(null);
		}
	}, [selectedCompany, sortedCompanies]);

	const selectedIndex = selectedCompany
		? sortedCompanies.findIndex((company) => company.id === selectedCompany.id)
		: -1;

	const handleRowClick = (company: Company): void => {
		console.log('row clicked', company.id);
		setSelectedCompany((current) =>
			current && current.id === company.id ? null : company
		);
	};

	// Debug: log when selectedCompany changes
	useEffect(() => {
		console.log("selectedCompany changed:", selectedCompany && selectedCompany.id);
	}, [selectedCompany]);

	return (
		<section className="admin-content">
				<div className="admin-toolbar">
					<div className="admin-toolbar-left">
						<div className="">
							<p className="admin-kicker">Företagsregister</p>
							<h1 className="admin-title">Företag</h1>
						</div>
							
						<p className="admin-subtitle">Hantera och uppdatera företag i databasen</p>
					</div>
				</div>

				<Filter />

				<AdminTablePanel
					loading={loading}
					sortedCompanies={sortedCompanies}
					visibleCompanies={visibleCompanies}
					selectedCompany={selectedCompany}
					isSearchActive={isSearchActive}
					visibleRowCount={visibleRowCount}
					rowBatchSize={ROW_BATCH_SIZE}
					onRowClick={handleRowClick}
					onLoadMore={() => setVisibleRowCount((current) => current + ROW_BATCH_SIZE)}
				/>

				{/* overlay for drawer */}
				<div className={`drawer-overlay ${selectedCompany ? "show" : ""}`} onClick={() => setSelectedCompany(null)} />

				<aside className={`drawer ${selectedCompany ? "is-open" : ""}`} aria-hidden={!selectedCompany}>
					{selectedCompany ? (
						<>
							<div className="drawer-header">
								<div>
									<p className="drawer-kicker">Detaljer</p>
									<h2 className="drawer-title">{selectedCompany.companyName}</h2>
									<span className={`status-badge ${selectedCompany.called ? "status-called" : "status-pending"}`}>
										{selectedCompany.called ? "Uppringd" : "Väntar"}
									</span>
								</div>
								<button className="close-btn" onClick={() => setSelectedCompany(null)}>
									Stäng
								</button>
							</div>

							<div className="drawer-content">
								<CompanyCard company={selectedCompany} />
							</div>

							<div className="drawer-footer">
								<p>{selectedIndex >= 0 ? `${selectedIndex + 1} av ${sortedCompanies.length}` : ""}</p>
							</div>
						</>
					) : (
						<div className="drawer-empty">
							<p>Välj ett företag i tabellen för att se detaljer här.</p>
						</div>
					)}
				</aside>
		</section>
	);
};

export default Admin;
