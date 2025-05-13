// client/src/Validation/UserValidation.js
import * as yup from "yup";

export const userValidationsSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required."),
  
  email: yup
    .string()
    .email("Not valid email format.")
    .required("Email is required."),
  
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters.")
    .max(20, "Password must not exceed 20 characters.")
    .required("Password is required."),
  
  confirmpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords must match.")
    .required("Confirm Password is required.")
});
