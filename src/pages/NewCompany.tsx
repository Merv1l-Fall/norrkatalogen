import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import useCompanyStore from "@/stores/companyStore";
import "@/css/NewCompany.css";
import companySchema from "@/validation/newCompanySchema";
import { useNavigate } from "react-router-dom";
import type { NewCompanyFormData, CompanyVehicles } from "@/types";

const initFormData: NewCompanyFormData = {
  companyName: "",
  address: "",
  postalCode: "",
  city: "",
  notes: "",
  contactPerson: "",
  contactPhone: "",
  email: "",
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
    väghyvel: false,
  },
};

interface FormErrors {
  [key: string]: string | undefined;
}

const NewCompany = (): ReactElement => {
  const { AddCompany } = useCompanyStore();
  const [error, setError] = useState<FormErrors>({});
  const [touched, setTouched] = useState<boolean>(false);
  const [formData, setFormData] = useState<NewCompanyFormData>(initFormData);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.currentTarget;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    console.log("handleSubmit called");
    e.preventDefault();
    setError({});

    const { error: validationError } = companySchema.validate(formData, {
      abortEarly: false,
    });

    if (validationError) {
      const fieldErrors: FormErrors = {};
      validationError.details.forEach((err) => {
        const fieldName = err.path[0] as string;
        fieldErrors[fieldName] = err.message;
      });
      setError(fieldErrors);
      console.log(validationError);
      return;
    }

    void AddCompany(formData);
    setFormData(initFormData);
    setTouched(false);
  };

  const clearForm = (): void => {
    setFormData(initFormData);
    setError({});
    setTouched(false);
    console.log(touched);
  };

  const handleVehicleChange = (vehicle: keyof CompanyVehicles): void => {
    setFormData((prev) => ({
      ...prev,
      vehicles: {
        ...prev.vehicles,
        [vehicle]: !prev.vehicles[vehicle],
      },
    }));
  };

  const vehicleKeys: Array<keyof CompanyVehicles> = [
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
    "flakvaxlare",
    "trailerdragare",
    "asfalstrailer",
  ];

  return (
    <div>
      <button
        className="new-company-back-btn"
        onClick={() => {
          navigate("/admin");
        }}
      >
        Tillbaka till listan
      </button>
      <div className="new-company-container">
        <form className="add-company-form" onSubmit={handleSubmit}>
          <label htmlFor="companyName">Företag</label>
          <input
            id="companyName"
            type="text"
            className="add-company-inputs"
            value={formData.companyName}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.companyName}</p>

          <label htmlFor="address">Adress</label>
          <input
            id="address"
            type="text"
            className="add-company-inputs"
            value={formData.address}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.address}</p>

          <label htmlFor="city">Ort</label>
          <input
            id="city"
            type="text"
            className="add-company-inputs"
            value={formData.city}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.city}</p>

          <label htmlFor="postalCode">Postnummer</label>
          <input
            id="postalCode"
            type="text"
            className="add-company-inputs"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.postalCode}</p>

          <label htmlFor="contactPerson">Kontaktperson</label>
          <input
            id="contactPerson"
            type="text"
            className="add-company-inputs"
            value={formData.contactPerson}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.contactPerson}</p>

          <label htmlFor="contactPhone">Telefon</label>
          <input
            id="contactPhone"
            type="text"
            className="add-company-inputs"
            value={formData.contactPhone}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.contactPhone}</p>

          <label htmlFor="email">E-post</label>
          <input
            id="email"
            type="text"
            className="add-company-inputs"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />
          <p className="error">{error.email}</p>

          <fieldset>
            <legend>Fordonsflotta</legend>
            <div className="vehicle-grid">
              {vehicleKeys.map((vehicle) => (
                <label key={vehicle}>
                  <input
                    type="checkbox"
                    checked={formData.vehicles[vehicle] ?? false}
                    onChange={() => handleVehicleChange(vehicle)}
                  />
                  {String(vehicle).charAt(0).toUpperCase() + String(vehicle).slice(1)}
                </label>
              ))}
            </div>
          </fieldset>

          <label htmlFor="notes">Noteringar</label>
          <textarea
            id="notes"
            className="add-company-textarea"
            value={formData.notes ?? ""}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
          />

          <div>
            <button
              type="submit"
              className="add form-btn"
              disabled={!touched}
            >
              Lägg till
            </button>
            <button
              type="button"
              className="clear form-btn"
              onClick={clearForm}
              disabled={!touched}
            >
              Töm formulär
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCompany;
