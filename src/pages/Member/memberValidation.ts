import * as yup from "yup";

export const memberValidation = yup.object().shape({
  memberId: yup
    .string()
    .required("Member ID is required"),
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"], "Gender must be Male, Female, or Other")
    .required("Gender is required"),
  dateOfBirth: yup.string()
    .required("Date of birth is required")
    .nullable(),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters long"),
  city: yup
    .string()
    .required("City is required")
    .min(2, "City must be at least 2 characters long"),
  state: yup
    .string()
    .required("State is required")
    .min(2, "State must be at least 2 characters long"),
  zipCode: yup
    .string()
    .required("Zip code is required")
    .matches(/^[0-9]{5}$/, "Zip code must be 5 digits"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  email: yup.string().required(),
  emergencyContactName: yup
    .string()
    .required("Emergency contact name is required")
    .min(3, "Emergency contact name must be at least 3 characters long"),
  emergencyContactPhone: yup
    .string()
    .required("Emergency contact phone number is required")
    .matches(/^[0-9]{10}$/, "Emergency contact phone number must be 10 digits"),
  displayImage: yup.string(), // Optional field
  weight: yup.number(),
  height: yup.number(),
  fat: yup.number(),
  arms: yup.number(),
  thigh: yup.number(),
  waist: yup.number(),
  chest: yup.number(),
  membershipId: yup.string().required("Membership ID is required"),
  firstPaymentDate: yup.string().required("First Payment Date is required"),
});
