import { memo, type ChangeEvent, type ReactElement } from "react";

import "@/css/CompanyCard.css";
import type { Company } from "@/types";

interface CompanyCardProps {
  company: Company;
  editedCompany: Company;
  isEditing: boolean;
  onFieldChange: (field: keyof Company, value: unknown) => void;
  onFleetChange: (vehicle: string) => void;
  onCalledChange: (checked: boolean) => void;
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

const CompanyCard = ({
  company,
  editedCompany,
  isEditing,
  onFieldChange,
  onFleetChange,
  onCalledChange,
}: CompanyCardProps): ReactElement => {

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    onFieldChange(name as keyof Company, value);
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = event.currentTarget;
    onFieldChange(name as keyof Company, value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.currentTarget;
    onCalledChange(checked);
  };

  return (
    <div className="company-card">
      {/* Company Info */}
      <div className="company-section">
        {isEditing ? (
          <>
            <input
              name="companyName"
              value={editedCompany.companyName}
              onChange={handleTextChange}
            />
            <input
              name="address"
              value={editedCompany.address}
              onChange={handleTextChange}
            />
            <input
              name="postalCode"
              value={editedCompany.postalCode}
              onChange={handleTextChange}
            />
            <input
              name="city"
              value={editedCompany.city}
              onChange={handleTextChange}
            />
          </>
        ) : (
          <>
            <p className="company-name">{company.companyName}</p>
            <p>{company.address}</p>
            <p>
              {company.postalCode} {company.city}
            </p>
          </>
        )}
      </div>

      {/* Contact Info */}
      <div className="contact-section">
        {isEditing ? (
          <>
            <label htmlFor="contact-person">Kontaktperson</label>
            <input
              id="contact-person"
              name="contactPerson"
              type="text"
              value={editedCompany.contactPerson}
              onChange={handleTextChange}
            />
            <label htmlFor="phone">Telefon</label>
            <input
              id="phone"
              name="contactPhone"
              type="text"
              value={editedCompany.contactPhone}
              onChange={handleTextChange}
            />
            <label htmlFor="email">E-post</label>
            <input
              id="email"
              name="email"
              type="text"
              value={editedCompany.email}
              onChange={handleTextChange}
            />
            <label className="ringt-checkbox">
              Ringt?
              <input
                type="checkbox"
                checked={editedCompany.called ?? false}
                onChange={handleCheckboxChange}
              />
            </label>
          </>
        ) : (
          <>
            <p className="contact-info-header">Kontaktperson</p>
            <p>{company.contactPerson}</p>
            <p>Telefon</p>
            <p>{company.contactPhone}</p>
            <p>E-post</p>
            <p>{company.email}</p>
            <label className="ringt-checkbox">
              Ringt?
              <input
                className="called-checkbox"
                type="checkbox"
                checked={company.called ?? false}
                disabled
              />
            </label>
          </>
        )}
      </div>

      {/* Notes */}
      <div className="notes-section">
        <h3>Noteringar</h3>
        {isEditing ? (
          <textarea
            name="notes"
            value={editedCompany.notes ?? ""}
            onChange={handleTextAreaChange}
          />
        ) : (
          <p>{company.notes}</p>
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
                checked={editedCompany.vehicles[vehicle] ?? false}
                onChange={() => onFleetChange(vehicle)}
                disabled={!isEditing}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(CompanyCard);
