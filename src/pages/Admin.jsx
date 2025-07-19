import Filter from "../components/Filter"
import CompanyCard from "../components/CompanyCard";
import sampleCompanies from "../data/testData";
import useCompanyStore from "../stores/companyStore.js";
import "../css/Admin.css"


const Admin = () => {
	const companies = useCompanyStore((state) => state.companies);
	const searchTerm = useCompanyStore((state) => state.searchTerm);
	const hideCalled = useCompanyStore((state) => state.hideCalled);
	const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);

	const filteredCompanies = companies.filter((company) => {
		if (hideCalled && company.called) return false;

		const term = searchTerm.toLowerCase();
		const match = company.companyName?.toLowerCase().includes(term);
		if (!match) return false;

		if (selectedVehicles.length > 0) {
			return selectedVehicles.every((v) => company.vehicles?.[v]);
		}

		return true;
	});

	const sortedCompanies = filteredCompanies.sort((a, b) => {
		const nameA = a.companyName.toLowerCase();
		const nameB = b.companyName.toLowerCase();
		return nameA.localeCompare(nameB);
	});

	
	return (
		<main className="admin-page">
			<Filter />

			<div className="company-list">
				{sortedCompanies.map((company, index) => (
					<CompanyCard key={index} company={company} />
				))}
			</div>
		</main>
	)

}

export default Admin;