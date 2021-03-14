import VanillaValidate from "./vanilla-validate.js";

const exampleForm = document.getElementById("exampleForm");

const charactersOnly = (field) => {
  return /^([^0-9()[\]{}*&^%$#@!]*)$/.test(field.value);
};

const transactionAmountValidator = (field) => {
  // Return true if valid;
  const value = parseFloat(field.value);
  if (isNaN(value)) {
    return false;
  }
  return value >= 0 && value <= 100_000_000;
};

const customValidators = {
  transactionAmount: {
    validator: transactionAmountValidator,
    errorMessage:
      "Transactions must be greater than 0 and less than 100 million.",
  },
  charactersOnly: {
    validator: charactersOnly,
    errorMessage: "Should only contain letters",
  },
};

/**
 * Initialize Vanilla Validate
 * the form is the only required parameter
 */
const exampleValidator = new VanillaValidate(
  exampleForm,
  null,
  customValidators
);
exampleValidator.initialize();
