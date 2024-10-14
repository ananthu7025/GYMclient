import * as yup from "yup";

export const gymValidationSchema = yup.object().shape({
  name: yup.string().required("Gym Name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string(),
  zipCode: yup.string().required("Zip Code is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone is required"),
  franchiseId: yup.string(),
  email: yup.string().email("Invalid email").required("Gym Email is required"),
  website: yup.string().url("Invalid URL"),
  openingHours: yup.string().required("Opening hours are required"),
  closingHours: yup.string().required("Closing hours are required"),
  logo: yup.mixed(),
  gymAdmin: yup.object().shape({
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
