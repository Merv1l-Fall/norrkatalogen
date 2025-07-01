import Filter from "../components/Filter"
import CompanyCard from "../components/CompanyCard";
import sampleCompanies from "../data/testData";
import "../css/Admin.css"

const Admin = () => {

	return (
		<main className="admin-page">
			<Filter />

			<div className="company-list">
				{sampleCompanies.map((company, index) => (
					<CompanyCard key={index} company={company} />
				))}
			</div>
		</main>
	)

}

export default Admin;