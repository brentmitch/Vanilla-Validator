export default class VanillaValidate {
  constructor(form, config, customValidators) {
    this.config = {
      validateOnBlur: false,
      validateOnEntry: true,
      validateOnSubmit: true,
      ...config,
    };
    this.form = form;
    this.formIsValid = null;
    this.validators = {
      required: {
        validator: this.isValidRequired,
        errorMessage: "This is a required field.",
      },
      email: {
        validator: this.isValidEmail,
        errorMessage: "Please enter a valid email.",
      },
      ...customValidators,
    };
  }

  initialize() {
    this.setFormValidations(this.form);
    this.config.validateOnBlur && this.initializeValidateOnBlur();
    this.config.validateOnEntry && this.initializeValidateOnEntry();
    this.config.validateOnSubmit && this.initializeValidateOnSubmit();
  }

  /** Generates a validations array to track which validations need to be
   * performed on each field and their status. 
   * Example:
   * 
   *  formValidations [
   *  {
   *    field: formElement
   *    validations: [
   *      {
   *        type: required
   *        status: false
   *      }
   *    ],
   *  error:''
  },
 ]
*/
  setFormValidations(form) {
    const fields = form.querySelectorAll("[data-validate");
    this.formValidations = [];
    fields.forEach((field) => {
      const fieldValidations = {
        field,
        validations: [],
        error: null,
      };

      // required
      if (field.hasAttribute("required")) {
        fieldValidations.validations.push({ type: "required", status: null });
      }

      // email type
      if (field.type === "email") {
        fieldValidations.validations.push({ type: "email", status: null });
      }

      // custom validator
      const validateType = field.dataset.validateType;
      if (validateType && this.validators[validateType]) {
        fieldValidations.validations.push({ type: validateType, status: null });
      }

      if (fieldValidations.validations.length > 0) {
        this.formValidations.push(fieldValidations);
      }
    });
  }

  initializeValidateOnSubmit() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.validateAllFields();
      this.displayAllFormItemErrors();
      this.displayFormError();
    });
  }

  initializeValidateOnEntry() {
    this.formValidations.forEach((formItem) => {
      formItem.field.addEventListener("input", () => {
        this.validateAllFields();
        this.displayFormItemError(formItem);
        this.displayFormError();
      });
    });
  }

  initializeValidateOnBlur() {
    this.formValidations.forEach((formItem) => {
      formItem.field.addEventListener("blur", () => {
        this.validateAllFields();
        this.displayFormItemError(formItem);
        this.displayFormError();
      });
    });
  }

  validateItem(formItem) {
    formItem.error = null;
    formItem.validations.forEach((validation) => {
      const currentValidator = this.validators[validation.type];
      validation.status = currentValidator.validator(formItem.field);
      if (validation.status === false) {
        formItem.error = formItem.error || currentValidator.errorMessage;
      }
    });
  }

  validateAllFields() {
    this.formValidations.forEach((formItem) => {
      formItem.validations.forEach((validation) => {
        this.validateItem(formItem);
      });
    });
  }

  displayAllFormItemErrors() {
    this.formValidations.forEach((formItem) => {
      this.displayFormItemError(formItem);
    });
  }

  displayFormItemError(formItem) {
    const validateMessageElement = formItem.field.parentNode.querySelector(
      "[data-validate-message]"
    );
    if (formItem.error) {
      formItem.field.classList.add("validate-error");
      if (validateMessageElement) {
        validateMessageElement.innerText = formItem.error;
      }
    } else {
      formItem.field.classList.remove("validate-error");
      if (validateMessageElement) {
        validateMessageElement.innerText = "";
      }
    }
  }

  displayFormError() {
    const formHasErrors = this.formValidations.some(
      (item) => item.error !== null
    );
    if (formHasErrors) {
      this.form.classList.add("validate-form-error");
    } else {
      this.form.classList.remove("validate-form-error");
    }
  }

  isValidRequired({ value }) {
    return Boolean(value.trim() !== "");
  }

  isValidEmail({ value }) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(value);
  }
}
