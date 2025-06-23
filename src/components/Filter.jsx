import "../css/Filter.css";
import { useState } from "react";

const Filter = () => {
	return (
		<div className="filter-container">
			<div>
				<input type="text" value={"Sök företag"} />
				<label htmlFor="called-checkbox">Visa uppringda företag?</label>
				<input id="called-checkbox" type="checkbox" />
			</div>
			{/* TODO make this dropdown with checkboxes */}
			<select name="fordon" id="fordon">
				<option value="Alla Fordon"> Alla fordon</option>
				<option value={"Grusbil"}>Grusbil</option>
				<option value={"Godsbil"}>Godsbil</option>
				<option value={"Timmerbil"}>Timmerbil</option>
				<option value={"Bulkbil"}>Bulkbil</option>
				<option value={"Väghybel"}>Väghyvel</option>
				<option value={"Hjullastare"}>Hjullastare</option>
				<option value={"Baklastare"}>Baklastare</option>
				<option value={"Kranbil"}>Kranbil</option>
				<option value={"Flisbil"}>Flisbil</option>
				<option value={"Dumper"}>Dumper</option>
				<option value={"Skogsmaskin"}>Skogsmaskin</option>
				<option value={"Grävare"}>Grävare</option>
			</select>
		</div>
	)
}

export default Filter;
// This component is a filter for the admin page, allowing users to search for companies and select vehicle types.