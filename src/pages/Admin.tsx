import { useEffect, useMemo, useState, type ReactElement } from "react";
import Filter from "@/components/Filter";
import CompanyCard from "@/components/CompanyCard";
import AdminTablePanel from "../components/AdminTablePanel";
import { updateCompany } from "@/data/crud";
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
	const updateCompanyLocally = useCompanyStore((state) => state.updateCompanyLocally);

	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
	const [editedCompany, setEditedCompany] = useState<Company | null>(null);
	const [isEditing, setIsEditing] = useState(false);
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

	useEffect(() => {
		if (!selectedCompany) {
			setEditedCompany(null);
			setIsEditing(false);
			return;
		}

		setEditedCompany(selectedCompany);
		setIsEditing(false);
	}, [selectedCompany]);

	const handleFieldChange = (field: keyof Company, value: unknown): void => {
		setEditedCompany((current) => (current ? { ...current, [field]: value } : current));
	};

	const handleFleetChange = (vehicle: string): void => {
		setEditedCompany((current) =>
			current
				? {
					...current,
					vehicles: {
						...current.vehicles,
						[vehicle]: !current.vehicles?.[vehicle],
					},
				}
				: current
		);
	};

	const handleCalledChange = (checked: boolean): void => {
		handleFieldChange("called", checked);
	};

	const handleDrawerAction = (): void => {
		if (!selectedCompany || !editedCompany) {
			return;
		}

		if (!isEditing) {
			setIsEditing(true);
			return;
		}

		setIsEditing(false);
		updateCompanyLocally(editedCompany);
		setSelectedCompany(editedCompany);
		void updateCompany(editedCompany.id, editedCompany)
			.then(() => {
				console.log("Company updated successfully");
			})
			.catch((error) => {
				console.error("Error updating company:", error);
			});
	};

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
									<h2 className="drawer-title">{editedCompany?.companyName ?? selectedCompany.companyName}</h2>
									<span className={`status-badge ${(editedCompany?.called ?? selectedCompany.called) ? "status-called" : "status-pending"}`}>
										{(editedCompany?.called ?? selectedCompany.called) ? "Uppringd" : "Väntar"}
									</span>
								</div>
								<div className="drawer-actions">
									<button className="drawer-action-btn" onClick={handleDrawerAction}>
										{isEditing ? "Spara" : "Redigera"}
									</button>
									<button className="close-btn" onClick={() => setSelectedCompany(null)}>
										Stäng
									</button>
								</div>
							</div>

							<div className="drawer-content">
								<CompanyCard
									company={selectedCompany}
									editedCompany={editedCompany ?? selectedCompany}
									isEditing={isEditing}
									onFieldChange={handleFieldChange}
									onFleetChange={handleFleetChange}
									onCalledChange={handleCalledChange}
								/>
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
