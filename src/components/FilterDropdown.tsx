import { useState, type ChangeEvent, type ReactElement } from "react";

import "@/css/FilterDropdown.css";

const vehicleTypes: string[] = [
  "Grusbil",
  "Godsbil",
  "Timmerbil",
  "Bulkbil",
  "Väghyvel",
  "Hjullastare",
  "Baklastare",
  "Kranbil",
  "Flisbil",
  "Dumper",
  "Skogsmaskin",
  "Grävare",
  "Maskintrailer",
  "Flakväxlare",
  "Trailerdragare",
  "Asfaltstrailer",
];

interface FilterDropdownProps {
  selected: string[];
  setSelected: (vehicles: string[]) => void;
}

const FilterDropdown = ({
  selected,
  setSelected,
}: FilterDropdownProps): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedArray = Array.isArray(selected) ? selected : [];

  const toggleOption = (type: string): void => {
    const arr = Array.isArray(selected) ? selected : [];
    const newSelected = arr.includes(type)
      ? arr.filter((item) => item !== type)
      : [...arr, type];
    setSelected(newSelected);
  };

  const handleCheckboxChange = (
    type: string,
    _event: ChangeEvent<HTMLInputElement>
  ): void => {
    toggleOption(type);
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
                    onChange={(e) => handleCheckboxChange(type, e)}
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
};

export default FilterDropdown;
