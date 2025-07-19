import "../css/Filter.css";
import FilterDropdown from "./FilterDropdown";
import useCompanyStore from "../stores/companyStore.js";
import { useState, useEffect, use } from "react";
import useDebounce from "../utils/useDebounce";

const Filter = ({companies, onFilterChange}) => {
	const searchTerm = useCompanyStore((state) => state.searchTerm);
const setSearchTerm = useCompanyStore((state) => state.setSearchTerm);
const hideCalled = useCompanyStore((state) => state.hideCalled);
const setHideCalled = useCompanyStore((state) => state.setHideCalled);
const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);
const setSelectedVehicles = useCompanyStore((state) => state.setSelectedVehicles);

	const [input, setInput] = useState(searchTerm);
	const debouncedInput = useDebounce(input, 300);

	useEffect(() => {
		setSearchTerm(debouncedInput);
	}, [debouncedInput, setSearchTerm]);

	const handleSearchChange = (event) => {
		setInput(event.target.value);
	};

	const handleCalledChange = (event) => {
		setHideCalled(event.target.checked);
	};

	return (
		<div className="filter-container">
			<div className="filter-inner-container">
				<input type="text" className="search-input" value={input} onChange={handleSearchChange} />
				<label htmlFor="called-checkbox">Dölj uppringda företag?</label>
				<input id="called-checkbox" type="checkbox" checked={hideCalled} onChange={handleCalledChange} />
			</div>
			<FilterDropdown selected={selectedVehicles} setSelected={setSelectedVehicles} />
		</div>
	)
}

export default Filter;
// This component is a filter for the admin page, allowing users to search for companies and select vehicle types.