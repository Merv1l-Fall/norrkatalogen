import { useState, useEffect, type ChangeEvent, type ReactElement } from "react";

import "@/css/Filter.css";
import FilterDropdown from "./FilterDropdown";
import useCompanyStore from "@/stores/companyStore";
import useDebounce from "@/utils/useDebounce";

const Filter = (): ReactElement => {
  const searchTerm = useCompanyStore((state) => state.searchTerm);
  const setSearchTerm = useCompanyStore((state) => state.setSearchTerm);
  const hideCalled = useCompanyStore((state) => state.hideCalled);
  const setHideCalled = useCompanyStore((state) => state.setHideCalled);
  const selectedVehicles = useCompanyStore((state) => state.selectedVehicles);
  const setSelectedVehicles = useCompanyStore(
    (state) => state.setSelectedVehicles
  );
  const showWithNotesOnly = useCompanyStore(
    (state) => state.showWithNotesOnly
  );
  const setShowWithNotesOnly = useCompanyStore(
    (state) => state.setShowWithNotesOnly
  );

  const [input, setInput] = useState<string>(searchTerm);
  const debouncedInput = useDebounce<string>(input, 200);

  useEffect(() => {
    setSearchTerm(debouncedInput);
  }, [debouncedInput, setSearchTerm]);

  useEffect(() => {
    setInput(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  };

  const handleCalledChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setHideCalled(event.target.checked);
  };

  const handleNotesToggle = (event: ChangeEvent<HTMLInputElement>): void => {
    setShowWithNotesOnly(event.target.checked);
  };

  return (
    <div className="filter-container">
      <div className="filter-inner-container">
        <input
          type="text"
          className="search-input"
          placeholder="Sök företag..."
          value={input}
          onChange={handleSearchChange}
        />
        <label htmlFor="called-checkbox">Dölj uppringda företag?</label>
        <input
          id="called-checkbox"
          type="checkbox"
          checked={hideCalled}
          onChange={handleCalledChange}
        />
        <label htmlFor="notes-checkbox">Dölj företag utan noteringar?</label>
        <input
          id="notes-checkbox"
          type="checkbox"
          checked={showWithNotesOnly}
          onChange={handleNotesToggle}
        />
      </div>
      <FilterDropdown selected={selectedVehicles} setSelected={setSelectedVehicles} />
    </div>
  );
};

export default Filter;
