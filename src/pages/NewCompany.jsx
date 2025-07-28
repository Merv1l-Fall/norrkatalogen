import { useState } from "react";
import useCompanyStore from "../stores/companyStore";
import "../css/NewCompany.css";
import companySchema from "../validation/newCompanySchema";

const NewCompany = () => {
	const { AddCompany } = useCompanyStore();
	const [error, setError] = useState({});

	const newCompany = {
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
	const [formData, setFormData] = useState({
		companyName: "",
		address: "",
		postalCode: "",
		city: "",
		notes: "",
		contactPerson: "",
		contactPhone: "",
	});

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
			// console.log(error)
			return;
		}


		const newCompanyData = {
			...newCompany,
			companyName: formData.companyName,
			address: formData.address,
			postalCode: formData.postalCode,
			city: formData.city,
			contactPerson: formData.contactPerson,
			contactPhone: formData.contactPhone
		};
		AddCompany(newCompanyData);
		setFormData({
			companyName: "",
			address: "",
			postalCode: "",
			city: "",
			notes: "",
			contactPerson: "",
			contactPhone: ""
		});
	}

	const clearForm = () => {
		setFormData({
			companyName: "",
			address: "",
			postalCode: "",
			city: "",
			notes: "",
			contactPerson: "",
			contactPhone: ""
		});
		setError({});
	}


	return (
		<div className="new-company-container">
			<form className="add-company-form" onSubmit={handleSubmit}>
				<label htmlFor="companyName">Företag</label>
				<input id="companyName" type="text" className="add-company-inputs" value={formData.companyName} onChange={handleChange} />
				<p className="error">{error.companyName}</p>

				<label htmlFor="address">Adress</label>
				<input id="address" type="text" className="add-company-inputs" value={formData.address} onChange={handleChange} />
				<p className="error">{error.address}</p>

				<label htmlFor="city">Ort</label>
				<input id="city" type="text" className="add-company-inputs" value={formData.city} onChange={handleChange} /> 
				<p className="error">{error.city}</p>

				<label htmlFor="postalCode">Postnummer</label>
				<input id="postalCode" type="text" className="add-company-inputs" value={formData.postalCode} onChange={handleChange}/>
				<p className="error">{error.postalCode}</p>

				<label htmlFor="contactPerson">Kontaktperson</label>
				<input id="contactPerson" type="text" className="add-company-inputs" value={formData.contactPerson} onChange={handleChange} />
				<p className="error">{error.contactPerson}</p>

				<label htmlFor="contactPhone">Telefon</label>
				<input id="contactPhone" type="text" className="add-company-inputs" value={formData.contactPhone} onChange={handleChange} />
				<p className="error">{error.contactPhone}</p>
				
				<div>
					<button type="submit" className="add form-btn">Lägg till</button>
					<button type="button" className="clear form-btn" onClick={clearForm}>Töm formulär</button>
				</div>
			</form>


		</div>
	)
}

export default NewCompany;