import { check } from 'express-validator';

export let readId;

export const setReadId = (val) => {
  readId = val;
};


// Helper function for common string validations
const stringValidation = (field, fieldName, options = {}) => {
  const { isRequired = true, maxLength = 255, minLength = 0 } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} must be a non-empty string!`)
    );
  }

  validations.push(
    check(field)
    .if(check(field).exists())
      .isString()
      .withMessage(`${fieldName} must be a string!`)
      .trim()
  );


  validations.push(
    check(field)
      .isLength({ max: maxLength, min: minLength })
      .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters long!`)
  );

  return validations;
};

// Helper function for common numeric string validations
const numericStringValidation = (field, fieldName, options = {}) => {
  const { isRequired = true, maxLength = 255 } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push(
    check(field)
    .if(check(field).exists())
      .isString()
      .withMessage(`${fieldName} must be a string!`)
      .trim()
      .matches(/^\d+$/)
      .withMessage(`${fieldName} must be a numeric string!`)
      .isLength({ max: maxLength })
      .withMessage(`${fieldName} cannot exceed ${maxLength} characters!`)
  );


  return validations;
};

// Helper function for common alphabetic string validations
const alphabeticStringValidation = (field, fieldName, options = {}) => {
  const { isRequired = true, maxLength = 255 } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

   validations.push (
    check(field)
    .if(check(field).exists())
      .isString()
      .withMessage(`${fieldName} must be a string!`)
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${fieldName} cannot exceed ${maxLength} characters!`)
      .matches(/^[A-Za-z\s]+$/)
      .withMessage(`${fieldName} can only contain alphabetic characters!`)
   );


  return validations;
};

// Helper function for common alphanumeric string validations
const alphanumericStringValidation = (field, fieldName, options = {}) => {
  const { isRequired = true, maxLength = 255, isPassword = false } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
    check(field)
    .if(check(field).exists())
      .isString()
      .withMessage(`${fieldName} must be a string!`)
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${fieldName} cannot exceed ${maxLength} characters!`)
  );

  if(isPassword) {
    validations.push(
      check(field)
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    );
  }
  else{
    validations.push(
      check(field)
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\s]+$/) // Regex for alphanumeric strings
        .withMessage(`${fieldName} must contain both letters and numbers only!`)
    );
  }

  return validations;
};

// Helper function for mobile number validations using regex
const mobileNumberValidation = (field, fieldName, options = {}) => {
  const { isRequired = true } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
        check(field)
            .notEmpty()
            .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
      check(field)
      .if(check(field).exists())
          .trim()
          .isString()
          .withMessage(`${fieldName} must be a string!`)
          .isLength({ min: 10, max: 10 })
          .withMessage(`${fieldName} must be exactly 10 digits long!`)
          .matches(/^[6-9]\d{9}$/) // Regex to match mobile numbers starting with 6, 7, 8, or 9
          .withMessage(`${fieldName} should be valid!`)
  );

  return validations;
};


// Helper function for numeric field validations
const numericValidation = (field, fieldName, options = {}) => {
  const {
    isRequired = true,
    maxDigits = 100,
    maxValue = 9999999999,
    minValue = 0
  } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

   validations.push (
    check(field)
    .if(check(field).exists())
      .trim()
      .isNumeric()
      .withMessage(`${fieldName} must be a number!`)
      .isFloat({ min: minValue, max: maxValue })
      .withMessage(`${fieldName} must be between ${minValue} and ${maxValue}`)
      .isLength({ max: maxDigits })
      .withMessage(`${fieldName} cannot exceed ${maxDigits} digits!`)
   );

  return validations;
};

// Helper function for validating an object field
const objectValidation = (field, fieldName, options = {}) => {
  const { isRequired = true } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
    check(field)
    .if(check(field).exists())
      .isObject()
      .withMessage(`${fieldName} must be an object!`)
  );


  return validations;
};

// Helper function for validating an array field
const arrayValidation = (field, fieldName, options = {}) => {
  const { isRequired = true, minLength = 1 } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }
  
  validations.push (
    check(field)
    .if(check(field).exists())
      .isArray({ min: minLength })
      .withMessage(`${fieldName} must be an array with at least ${minLength} element(s)!`)
  );


  return validations;
};

// Helper function for validating an email field
const emailValidation = (field, fieldName, options = {}) => {
  const { isRequired = true } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
    check(field)
    .if(check(field).exists())
      .isEmail()
      .withMessage(`${fieldName} must be a valid email address!`)
      .trim()
  );


  return validations;
};

// Helper function for validating a date field
const dateValidation = (field, fieldName, options = {}) => {
  const { isRequired = true } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
    check(field)
    .if(check(field).exists())
      .isDate()
      .withMessage(`${fieldName} must be a valid date!`)
  );


  return validations;
};

// Helper function for validating a date-time field
const dateTimeValidation = (field, fieldName, options = {}) => {
  const { isRequired = true } = options;

  const validations = [];

  if (isRequired) {
    validations.push(
      check(field)
        .notEmpty()
        .withMessage(`${fieldName} is required!`)
    );
  }

  validations.push (
    check(field)
    .if(check(field).exists())
      .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
      .withMessage(
        `${fieldName} must be a valid datetime in 'YYYY-MM-DD HH:mm:ss' format!`
      )
  );


  return validations;
};

// // Validation chain for invoice_items.*.item_id
// export const itemIDValidationChain = numericValidation(
//   'invoice_items.*.item_id',
//   'Item ID',
//   { isRequired: true }
// );

// // Validation chain for invoice_items.*.quantity
// export const quantityValidationChain = numericValidation(
//   'invoice_items.*.quantity',
//   'Item Quantity',
//   { isRequired: true }
// );

export const isRead = (field) => [
  check(field).custom((value) => {
    value = value.map((value) => parseInt(value));
    if (value.length > 0 && !value.includes(readId)) {
      throw new Error(`View is required to perform any other operation!`);
    }
    return true;
  }),
];

export default {
  stringValidation,
  numericStringValidation,
  alphabeticStringValidation,
  alphanumericStringValidation,
  numericValidation,
  objectValidation,
  arrayValidation,
  emailValidation,
  dateValidation,
  dateTimeValidation,
  mobileNumberValidation
};