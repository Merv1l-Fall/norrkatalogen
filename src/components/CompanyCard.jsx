import { useState, useEffect } from "react";
import "../css/CompanyCard.css";
import { updateCompany } from "../data/crud";
import React from "react";
import useCompanyStore from "../stores/companyStore.js";

const CompanyCard = ({ company }) => {
	const [editMode, setEditMode] = useState(false);
	const [editedData, setEditedData] = useState(company);

	const updateCompanyLocally = useCompanyStore(
		(state) => state.updateCompanyLocally);

	const VEHICLE_ORDER = [
		"grusbil", "godsbil", "timmerbil", "bulkbil", "väghyvel", "hjullastare",
		"baklastare", "kranbil", "flisbil", "dumper", "skogsmaskin", "grävare"
	];


	useEffect(() => {
		setEditedData(company); // Sync when Company prop changes
	}, [company]);

	const handleChange = (field, value) => {
		setEditedData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFleetChange = (vehicle) => {
		setEditedData((prev) => ({
			...prev,
			vehicles: {
				...prev.vehicles,
				[vehicle]: !prev.vehicles[vehicle],
			},
		}));
	};

	const handleSave = () => {
		// Firestore update here
		console.log("Saved data:", editedData);
		setEditMode(false);
		updateCompany(editedData.id, editedData)
			.then(() => {
				console.log("Company updated successfully");
			})
			.catch((error) => {
				console.error("Error updating company:", error);
			});
		console.log("Updating company locally");
		updateCompanyLocally(editedData);
	};

	return (
		<div className="company-card">
			{/* Company Info */}
			<div className="company-section">
				{editMode ? (
					<>
						<input
							value={editedData.companyName}
							onChange={(e) =>
								handleChange("companyName", e.target.value)
							}
						/>
						<input
							value={editedData.address}
							onChange={(e) =>
								handleChange("address", e.target.value)
							}
						/>
						<input
							value={editedData.postalCode}
							onChange={(e) =>
								handleChange("postalCode", e.target.value)
							}
						/>
						<input
							value={editedData.city}
							onChange={(e) =>
								handleChange("city", e.target.value)
							}
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
					onClick={() =>
						editMode ? handleSave() : setEditMode(true)
					}
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
							type="text"
							value={editedData.contactPerson}
							onChange={(e) =>
								handleChange("contactPerson", e.target.value)
							}
						/>
						<label htmlFor="phone">Telefon</label>
						<input
							id="phone"
							type="text"
							value={editedData.contactPhone}
							onChange={(e) =>
								handleChange("contactPhone", e.target.value)
							}
						/>
						<label htmlFor="email">E-post</label>
						<input
							id="email"
							type="text"
							value={editedData.email}
							disabled={!editMode}
							onChange={(e) =>
								handleChange("email", e.target.value)
							}
						/>
						<label className="ringt-checkbox">
							Ringt?
							<input
								type="checkbox"
								checked={editedData.called}
								disabled={!editMode}
								onChange={() =>
									handleChange("called", !editedData.called)
								}
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
								disabled={!editMode}
								type="checkbox"
								checked={editedData.called}
								onChange={() =>
									handleChange("called", !editedData.called)
								}
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
						value={editedData.notes}
						onChange={(e) => handleChange("notes", e.target.value)}
					/>
				) : (
					<p>{editedData.notes}</p>
				)}
			</div>

			{/* Fleet */}
			<div className="fleet-section">
				<div className="fleet-title">Fordonsflotta</div>
				<div className="fleet-grid">
					{VEHICLE_ORDER.map(vehicle => (
						<label key={vehicle}>
							<span className="vehicle-label">
								{vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}

							</span>
							<input
								className="vehicle-checkbox"
								type="checkbox"
								checked={!!editedData.vehicles[vehicle]}
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

export default React.memo(CompanyCard);
