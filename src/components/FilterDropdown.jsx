import { useState } from "react";
import "../css/FilterDropdown.css";

const vehicleTypes = [
  "Grusbil", "Godsbil", "Timmerbil", "Bulkbil", "Väghyvel", "Hjullastare",
  "Baklastare", "Kranbil", "Flisbil", "Dumper", "Skogsmaskin", "Grävare"
];

const FilterDropdown = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (type) => {
    setSelected((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
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
                    checked={selected.includes(type)}
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
