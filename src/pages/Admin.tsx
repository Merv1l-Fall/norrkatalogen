import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "@/components/Filter";
import CompanyCard from "@/components/CompanyCard";
import useCompanyStore from "@/stores/companyStore";
import exportToExcel from "@/utils/export";
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
		<main className="admin-page">
			<aside className="admin-sidebar">
				<div className="admin-sidebar-nav">
					<button className="admin-sidebar-item active" type="button">
						<span className="admin-sidebar-icon">📊</span>
						<span>Dashboard</span>
					</button>
					{/* <button className="admin-sidebar-item active" type="button">
						<span className="admin-sidebar-icon">🏢</span>
						<span>Företag</span>
					</button> */}
					<button className="admin-sidebar-item" type="button" onClick={() => navigate("/nytt-foretag")}>
						<span className="admin-sidebar-icon">➕</span>
						<span>Nytt företag</span>
					</button>
					<button className="admin-sidebar-item" type="button" onClick={() => exportToExcel(sortedCompanies)}>
						<span className="admin-sidebar-icon">📥</span>
						<span>Exportera</span>
					</button>
					{/* <button className="admin-sidebar-item" type="button" disabled={true}>
						<span className="admin-sidebar-icon">⚙️</span>
						<span>Inställningar</span>
					</button> */}
				</div>
			</aside>

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

				<div className="table-panel">
					{loading ? (
						<p className="loading-text">Laddar</p>
					) : sortedCompanies.length === 0 ? (
						<p className="no-companies">Inga företag hittades</p>
					) : (
						<div className="table-container">
							<table className="company-table">
								<thead>
									<tr>
										<th>Företag</th>
										<th>Adress</th>
										<th>Kontakt</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{visibleCompanies.map((company) => {
										const isSelected = selectedCompany?.id === company.id;
										return (
											<tr
												key={company.id}
												className={isSelected ? "selected" : ""}
												onClick={() => handleRowClick(company)}
											>
												<td>
													<div className="company-name">{company.companyName}</div>
												</td>
												<td>
													<div className="company-address">{company.address}, {company.postalCode} {company.city}</div>
												</td>
												<td>
													<div className="company-address">{company.contactPerson || "-"}</div>
												</td>
												<td>
													<span className={`status-badge ${company.called ? "status-called" : "status-pending"}`}>
														{company.called ? "Uppringd" : "Väntar"}
													</span>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
								{!isSearchActive && visibleRowCount < sortedCompanies.length ? (
								<div className="table-load-more">
									<button
										type="button"
										className="load-more-btn"
										onClick={() => setVisibleRowCount((current) => current + ROW_BATCH_SIZE)}
									>
										Visa fler ({Math.min(ROW_BATCH_SIZE, sortedCompanies.length - visibleRowCount)} till)
									</button>
									<p className="load-more-status">
										Visar {visibleCompanies.length} av {sortedCompanies.length} företag
									</p>
								</div>
							) : isSearchActive ? (
								<p className="load-more-status">
									Sökning visar {visibleCompanies.length} av {sortedCompanies.length} företag
								</p>
							) : (
								<p className="load-more-status">
									Visar alla {sortedCompanies.length} företag
								</p>
							)}
						</div>
					)}
				</div>

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
		</main>
	);
};

export default Admin;
