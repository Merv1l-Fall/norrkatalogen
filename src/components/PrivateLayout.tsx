import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import "@/css/PrivateLayout.css";

const PrivateLayout = (): ReactElement => {
	return (
		<main className="admin-page">
			<AdminSidebar />
			<div className="private-layout-content">
				<Outlet />
			</div>
		</main>
	);
};

export default PrivateLayout;
