import type { ReactElement } from "react";
import type { Company } from "@/types";
import "@/css/AdminTablePanel.css";

type AdminTablePanelProps = {
	loading: boolean;
	sortedCompanies: Company[];
	visibleCompanies: Company[];
	selectedCompany: Company | null;
	isSearchActive: boolean;
	visibleRowCount: number;
	rowBatchSize: number;
	onRowClick: (company: Company) => void;
	onLoadMore: () => void;
};

const AdminTablePanel = ({
	loading,
	sortedCompanies,
	visibleCompanies,
	selectedCompany,
	isSearchActive,
	visibleRowCount,
	rowBatchSize,
	onRowClick,
	onLoadMore,
}: AdminTablePanelProps): ReactElement => {
	if (loading) {
		return (
			<div className="table-panel">
				<p className="loading-text">Laddar</p>
			</div>
		);
	}

	if (sortedCompanies.length === 0) {
		return (
			<div className="table-panel">
				<p className="no-companies">Inga företag hittades</p>
			</div>
		);
	}

	return (
		<div className="table-panel">
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
									onClick={() => onRowClick(company)}
								>
									<td>
										<div className="company-name">{company.companyName}</div>
									</td>
									<td>
										<div className="company-address">
											{company.address}, {company.postalCode} {company.city}
										</div>
									</td>
									<td>
										<div className="company-address">{company.contactPerson || "-"}</div>
									</td>
									<td>
										<span
											className={`status-badge ${company.called ? "status-called" : "status-pending"}`}
										>
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
						<button type="button" className="load-more-btn" onClick={onLoadMore}>
							Visa fler ({Math.min(rowBatchSize, sortedCompanies.length - visibleRowCount)} till)
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
					<p className="load-more-status">Visar alla {sortedCompanies.length} företag</p>
				)}
			</div>
		</div>
	);
};

export default AdminTablePanel;
