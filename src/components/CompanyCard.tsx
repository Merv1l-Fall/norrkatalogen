import { useState, useEffect, memo, type ChangeEvent, type ReactElement } from "react";

import "@/css/CompanyCard.css";
import { updateCompany } from "@/data/crud";
import useCompanyStore from "@/stores/companyStore";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
}

const VEHICLE_ORDER: string[] = [
  "grusbil",
  "godsbil",
  "timmerbil",
  "bulkbil",
  "väghyvel",
  "hjullastare",
  "baklastare",
  "kranbil",
  "flisbil",
  "dumper",
  "skogsmaskin",
  "grävare",
  "maskintrailer",
  "flakväxlare",
  "trailerdragare",
  "asfaltstrailer",
];

const CompanyCard = ({ company }: CompanyCardProps): ReactElement => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<Company>(company);

  const updateCompanyLocally = useCompanyStore(
    (state) => state.updateCompanyLocally
  );

  useEffect(() => {
    setEditedData(company);
  }, [company]);

  const handleChange = (field: keyof Company, value: unknown): void => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFleetChange = (vehicle: string): void => {
    setEditedData((prev) => ({
      ...prev,
      vehicles: {
        ...prev.vehicles,
        [vehicle]: !prev.vehicles[vehicle],
      },
    }));
  };

  const handleSave = (): void => {
    console.log("Saved data:", editedData);
    setEditMode(false);
    void updateCompany(editedData.id, editedData)
      .then(() => {
        console.log("Company updated successfully");
      })
      .catch((error) => {
        console.error("Error updating company:", error);
      });
    console.log("Updating company locally");
    updateCompanyLocally(editedData);
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    handleChange(name as keyof Company, value);
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = event.currentTarget;
    handleChange(name as keyof Company, value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.currentTarget;
    handleChange("called", checked);
  };

  return (
    <div className="company-card">
      {/* Company Info */}
      <div className="company-section">
        {editMode ? (
          <>
            <input
              name="companyName"
              value={editedData.companyName}
              onChange={handleTextChange}
            />
            <input
              name="address"
              value={editedData.address}
              onChange={handleTextChange}
            />
            <input
              name="postalCode"
              value={editedData.postalCode}
              onChange={handleTextChange}
            />
            <input
              name="city"
              value={editedData.city}
              onChange={handleTextChange}
            />
          </>
        ) : (
          <>
            <p className="company-name">{editedData.companyName}</p>
            <p>{editedData.address}</p>
            <p>
              {editedData.postalCode} {editedData.city}
            </p>
          </>
        )}
        <button
          className="edit-button"
          onClick={() => (editMode ? handleSave() : setEditMode(true))}
        >
          {editMode ? "Spara" : "Redigera"}
        </button>
      </div>

      {/* Contact Info */}
      <div className="contact-section">
        {editMode ? (
          <>
            <label htmlFor="contact-person">Kontaktperson</label>
            <input
              id="contact-person"
              name="contactPerson"
              type="text"
              value={editedData.contactPerson}
              onChange={handleTextChange}
            />
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              name="contactPhone"
              type="text"
              value={editedData.contactPhone}
              onChange={handleTextChange}
            />
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="text"
              value={editedData.email}
              onChange={handleTextChange}
            />
            <label className="ringt-checkbox">
              Ringt?
              <input
                type="checkbox"
                checked={editedData.called ?? false}
                onChange={handleCheckboxChange}
              />
            </label>
          </>
        ) : (
          <>
            <p className="contact-info-header">Kontaktperson</p>
            <p>{editedData.contactPerson}</p>
            <p>Telefon</p>
            <p>{editedData.contactPhone}</p>
            <p>E-post</p>
            <p>{editedData.email}</p>
            <label className="ringt-checkbox">
              Ringt?
              <input
                className="called-checkbox"
                type="checkbox"
                checked={editedData.called ?? false}
                disabled
              />
            </label>
          </>
        )}
      </div>

      {/* Notes */}
      <div className="notes-section">
        <h3>Noteringar</h3>
        {editMode ? (
          <textarea
            name="notes"
            value={editedData.notes ?? ""}
            onChange={handleTextAreaChange}
          />
        ) : (
          <p>{editedData.notes}</p>
        )}
      </div>

      {/* Fleet */}
      <div className="fleet-section">
        <div className="fleet-title">Fordonsflotta</div>
        <div className="fleet-grid">
          {VEHICLE_ORDER.map((vehicle) => (
            <label key={vehicle}>
              <span className="vehicle-label">
                {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
              </span>
              <input
                className="vehicle-checkbox"
                type="checkbox"
                checked={editedData.vehicles[vehicle] ?? false}
                onChange={() => handleFleetChange(vehicle)}
                disabled={!editMode}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(CompanyCard);
