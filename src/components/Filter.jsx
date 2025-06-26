import "../css/Filter.css";
import { useState } from "react";
import FilterDropdown from "./FilterDropdown";

const Filter = () => {
	const [selectedVehicles, setSelectedVehicles] = useState([]);
	const [searchTerm, setSearchTerm] = useState("Sök företag");

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	return (
		<div className="filter-container">
			<div className="filter-inner-container">
				<input type="text" className="search-input" value={searchTerm} onChange={handleSearchChange} />
				<label htmlFor="called-checkbox">Visa uppringda företag?</label>
				<input id="called-checkbox" type="checkbox" />
			</div>
			<FilterDropdown selected={selectedVehicles} setSelected={setSelectedVehicles} />
		</div>
	)
}

export default Filter;
// This component is a filter for the admin page, allowing users to search for companies and select vehicle types.