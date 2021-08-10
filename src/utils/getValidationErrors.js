import { ValidationError } from "yup";


export default function getValidationErrors(err) {
  const validationErrors = {};

  err.inner.forEach((error) => {
    const valueName = error.path;

    if (valueName) {
      validationErrors[valueName] = error.message;
    }
  });

  return validationErrors;
}
