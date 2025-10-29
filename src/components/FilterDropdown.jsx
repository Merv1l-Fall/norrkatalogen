import { useState } from "react";
import "../css/FilterDropdown.css";

const vehicleTypes = [
  "Grusbil", "Godsbil", "Timmerbil", "Bulkbil", "Väghyvel", "Hjullastare",
  "Baklastare", "Kranbil", "Flisbil", "Dumper", "Skogsmaskin", "Grävare", "Maskintrailer", "Flakväxlare", "Trailerdragare", "Asfaltstrailer"
];

const FilterDropdown = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedArray = Array.isArray(selected) ? selected : [];

  const toggleOption = (type) => {
  const arr = Array.isArray(selected) ? selected : [];
  const newSelected = arr.includes(type)
    ? arr.filter((item) => item !== type)
    : [...arr, type];
  setSelected(newSelected);
};

  return (
    <div className="dropdown-wrapper">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-toggle"
      >
        Filtrera på fordon ▾
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            {vehicleTypes.map((type) => (
              <li key={type}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedArray.includes(type)}
                    onChange={() => toggleOption(type)}
                  />
                  {type}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// This component renders a dropdown menu for selecting vehicle types.

export default FilterDropdown;
