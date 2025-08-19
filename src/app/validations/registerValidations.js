import Joi from "joi";

const register = {
  body: Joi.object({
    email: Joi.string().email().lowercase().required(),
    firstName: Joi.string()
      .trim()
      .required()
      .max(10)
      .pattern(/^[a-zA-Z0-9_@]+(?: [a-zA-Z0-9@_]+)*$/)
      .messages({
        "string.pattern.base":
          "First Name cannot contain special characters or multiple consecutive spaces!",
      }),
    lastName: Joi.string()
      .trim()
      .required()
      .max(10)
      .pattern(/^[a-zA-Z0-9_@]+(?: [a-zA-Z0-9@_]+)*$/)
      .messages({
        "string.pattern.base":
          "Last Name cannot contain special characters or multiple consecutive spaces!",
      }),
    password: Joi.string()
      .required()
      .min(8)
      .pattern(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      ),
    phoneNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    userType: Joi.string().valid("BUYER", "SELLER").required(),
  }),
};

export default register;