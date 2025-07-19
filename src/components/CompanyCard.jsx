import { useState } from "react";
import "../css/CompanyCard.css";

const CompanyCard = ({ company }) => {
	const [editMode, setEditMode] = useState(false);
	const [editedData, setEditedData] = useState(company);

	const handleChange = (field, value) => {
		setEditedData(prev => ({ ...prev, [field]: value }));
	};

	const handleFleetChange = (vehicle) => {
		setEditedData(prev => ({
			...prev,
			fleet: {
				...prev.fleet,
				[vehicle]: !prev.fleet[vehicle],
			},
		}));
	};

	const handleSave = () => {
		// Firestore update here
		console.log("Saved data:", editedData);
		setEditMode(false);
	};

	return (
		<div className="company-card">
			{/* Company Info */}
			<div className="company-section">
				{editMode ? (
					<>
						<input
							value={editedData.companyName}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
						<input
							value={editedData.address}
							onChange={(e) => handleChange("address", e.target.value)}
						/>
						<input
							value={editedData.postalCode}
							onChange={(e) => handleChange("zip", e.target.value)}
						/>
						<input
							value={editedData.city}
							onChange={(e) => handleChange("city", e.target.value)}
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
				<button className="edit-button" onClick={() => (editMode ? handleSave() : setEditMode(true))}>
					{editMode ? "Spara" : "Redigera"}
				</button>
			</div>

			{/* Contact Info */}
			<div className="contact-section">
				{editMode ? (
					<>
						<label>Kontaktperson</label>
						<input
							value={editedData.contactPerson}
							onChange={(e) => handleChange("contact", e.target.value)}
						/>
						<label>Telefon</label>
						<input
							value={editedData.contactPhone}
							onChange={(e) => handleChange("phone", e.target.value)}
						/>
						<label className="ringt-checkbox">
							Ringt?
							<input
								type="checkbox"
								checked={editedData.called}
								onChange={() => handleChange("ringt", !editedData.called)}
							/>
						</label>
					</>
				) : (
					<>
						<p className="contact-info-header">Kontaktperson</p>
						<p>{editedData.contactPerson}</p>
						<p>Telefon</p>
						<p>{editedData.contactPhone}</p>
						<label className="ringt-checkbox">
							Ringt?
							<input className="called-checkbox" type="checkbox" checked={editedData.ringt} onChange={() => handleChange("ringt", !editedData.ringt)}/>
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
					{Object.entries(editedData.vehicles).map(([vehicle, hasVehicle]) => (
						<label key={vehicle}>
							{vehicle}
							<input className="vehicle-checkbox"
								type="checkbox"
								checked={hasVehicle}
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

export default CompanyCard;
