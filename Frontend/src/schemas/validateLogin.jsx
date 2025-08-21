// src/schemas/loginValidate.js

import * as Yup from "yup";

const loginValidateSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

export default loginValidateSchema;
