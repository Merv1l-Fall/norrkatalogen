import { useState } from "react";
import useCompanyStore from "../stores/companyStore";
import "../css/NewCompany.css";
import companySchema from "../validation/newCompanySchema";
import { useNavigate } from "react-router-dom";

const initFormData = {
	companyName: "",
	address: "",
	postalCode: "",
	city: "",
	notes: "",
	contactPerson: "",
	contactPhone: "",
	vehicles: {
		baklastare: false,
		bulkbil: false,
		dumper: false,
		flisbil: false,
		godsbil: false,
		grusbil: false,
		grävare: false,
		hjullastare: false,
		kranbil: false,
		skogsmaskin: false,
		timmerbil: false,
		väghyvel: false
	},
};

const NewCompany = () => {
	const { AddCompany } = useCompanyStore();
	const [error, setError] = useState({});
	const [touched, setTouched] = useState(false);
	const [formData, setFormData] = useState(initFormData);
	
	const navigate = useNavigate();


	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		});
	}

	const handleSubmit = (e) => {
		console.log("handleSubmit called");
		e.preventDefault();
		setError({});
		const { error } = companySchema.validate(formData, { abortEarly: false });
		if (error) {
			const fieldErrors = {};
			error.details.forEach((err) => {
				fieldErrors[err.path[0]] = err.message;
			});
			setError(fieldErrors);
			console.log(error)
			return;
		}


		AddCompany(formData);
		setFormData(initFormData);
		setTouched(false);
	}

	const clearForm = () => {
		setFormData(initFormData);
		setError({});
		setTouched(false);
		console.log(touched)
	}


	return (
		<div>
			<button className="new-company-back-btn" onClick={() => {navigate("/admin")}}>Tillbaka till listan</button> 
		<div className="new-company-container">
			<form className="add-company-form" onSubmit={handleSubmit}>
				<label htmlFor="companyName">Företag</label>
				<input
					id="companyName"
					type="text"
					className="add-company-inputs"
					value={formData.companyName}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.companyName}</p>

				<label htmlFor="address">Adress</label>
				<input
					id="address"
					type="text"
					className="add-company-inputs"
					value={formData.address}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.address}</p>

				<label htmlFor="city">Ort</label>
				<input
					id="city"
					type="text"
					className="add-company-inputs"
					value={formData.city}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.city}</p>

				<label htmlFor="postalCode">Postnummer</label>
				<input
					id="postalCode"
					type="text"
					className="add-company-inputs"
					value={formData.postalCode}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.postalCode}</p>

				<label htmlFor="contactPerson">Kontaktperson</label>
				<input
					id="contactPerson"
					type="text"
					className="add-company-inputs"
					value={formData.contactPerson}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.contactPerson}</p>

				<label htmlFor="contactPhone">Telefon</label>
				<input
					id="contactPhone"
					type="text"
					className="add-company-inputs"
					value={formData.contactPhone}
					onChange={handleChange}
					onBlur={() => setTouched(true)} />
				<p className="error">{error.contactPhone}</p>

				<div>
					<button type="submit" className="add form-btn" disabled={!touched}>Lägg till</button>
					<button type="button" className="clear form-btn" onClick={clearForm} disabled={!touched}>Töm formulär</button>
				</div>
			</form>
		</div>
		</div>
	)
}

export default NewCompany;