import * as yup from "yup";

export const franchiseValidationSchema = yup.object().shape({
  name: yup.string().required("Franchise Name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string(),
  zipCode: yup.string().required("Zip Code is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Franchise Email is required"),
  website: yup.string().url("Invalid URL"),
  establishedYear: yup
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year can't be in the future"),
  description: yup.string(),
  logo: yup.mixed(),
  franchiseAdmin: yup.object().shape({
    name: yup.string().required("Admin Name is required"),
    email: yup
      .string()
      .email("Invalid email")
      .required("Admin Email is required"),
    password: yup
      .string()
      .required("Admin Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});
