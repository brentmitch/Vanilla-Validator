# Vanilla Validator
## About ##
VanillaValidate Javascript class that can be used for simple form validation when native form validation is insufficient. 

## Current Features ##
* Validates inputs and selects
* Built in validation for:
    - Required
    - Email type
* Ability to make custom validators
* Adds 'validate-error' class inputs that are invalid
* Adds 'validate-form-error' to forms that are invalid
* If an input or select has an error, will display the error in a sibling element with the data attribute of 'validate-message' if one is present.
* Validate on submit (optional)
* Validate on input (optional)
* Validate on blur (optional)