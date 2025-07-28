import Joi from "joi";

const companySchema = Joi.object({
  companyName: Joi.string()
    .min(2)
    .max(100)
    .required().messages({
	  "string.empty": "Företagsnamn krävs",
	  "string.min": "Företagsnamnet måste vara minst 2 tecken långt",
	  "string.max": "Företagsnamnet får inte vara längre än 100 tecken",
	}),

  address: Joi.string()
    .min(5)
    .max(200)
    .required().messages({
	  "string.empty": "Adress krävs",
	  "string.min": "Adressen måste vara minst 5 tecken lång",
	  "string.max": "Adressen får inte vara längre än 200 tecken",
	}),

  city: Joi.string()
    .min(2)
    .max(100)
    .required().messages({
	  "string.empty": "Ort krävs",
	  "string.min": "Orten måste vara minst 2 tecken lång",
	  "string.max": "Orten får inte vara längre än 100 tecken",
	}),

  postalCode: Joi.string()
    .pattern(/^\d{5}$/)
    .required().messages({
	  "string.empty": "Postnummer krävs",
	  "string.pattern.base": "Postnumret måste vara exakt 5 siffror",
	}),

  contactPerson: Joi.string()
    .min(2)
    .max(100)
    .required().messages({
	  "string.empty": "Kontaktperson krävs",
	  "string.min": "Kontaktpersonens namn måste vara minst 2 tecken långt",
	  "string.max": "Kontaktpersonens namn får inte vara längre än 100 tecken",
	}),

  contactPhone: Joi.string()
    .pattern(/^[0-9+\-\s]{6,15}$/)
    .required()
	.messages({
	  "string.pattern.base": "Telefonnummer måste vara mellan 6 och 15 tecken och kan innehålla siffror, plus, bindestreck och mellanslag.",
	  "string.empty": "Telefonnummer krävs",
	  
}),
});

export default companySchema;