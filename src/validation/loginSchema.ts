import Joi from "joi";
import type { LoginFormData } from "@/types";

const loginSchema: Joi.ObjectSchema<LoginFormData> = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "E-postadress krävs",
      "string.email": "Ogiltigt e-postformat",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Lösenord krävs",
      "string.min": "Lösenordet måste vara minst 6 tecken långt",
    }),
});

export default loginSchema;
