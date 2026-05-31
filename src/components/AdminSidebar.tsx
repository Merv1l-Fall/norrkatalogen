import { useMemo, type ReactElement } from "react";
import { NavLink } from "react-router-dom";
import useCompanyStore from "@/stores/companyStore";
import exportToExcel from "@/utils/export";
import "@/css/AdminSidebar.css";

const AdminSidebar = (): ReactElement => {
	const companies = useCompanyStore((state) => state.companies);

	const sortedCompanies = useMemo(
		() =>
			[...companies].sort((a, b) => {
				const nameA = a.companyName.toLowerCase();
				const nameB = b.companyName.toLowerCase();
				return nameA.localeCompare(nameB);
			}),
		[companies]
	);

	return (
		<aside className="admin-sidebar">
			<nav className="admin-sidebar-nav">
				<NavLink
					to="/admin"
					end
					className={({ isActive }) => `admin-sidebar-item${isActive ? " active" : ""}`}
				>
					<span className="admin-sidebar-icon">📊</span>
					<span>Dashboard</span>
				</NavLink>
				<NavLink
					to="/nytt-foretag"
					className={({ isActive }) => `admin-sidebar-item${isActive ? " active" : ""}`}
				>
					<span className="admin-sidebar-icon">➕</span>
					<span>Nytt företag</span>
				</NavLink>
				<button className="admin-sidebar-item" type="button" onClick={() => exportToExcel(sortedCompanies)}>
					<span className="admin-sidebar-icon">📥</span>
					<span>Exportera</span>
				</button>
			</nav>
		</aside>
	);
};

export default AdminSidebar;
