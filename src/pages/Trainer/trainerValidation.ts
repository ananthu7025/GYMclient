import * as Yup from "yup";

export const TrainerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Trainer name is required")
    .min(2, "Trainer name must be at least 2 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),

  experience: Yup.number()
    .required("Experience is required")
    .min(0, "Experience cannot be negative")
    .integer("Experience must be an integer"),

  qualifications: Yup.string(),

  specialization: Yup.string(),

  salary: Yup.number()
    .required("Salary is required")
    .min(0, "Salary cannot be negative"),

  availability: Yup.object().shape({
    days: Yup.string(),
    timeSlots: Yup.string(),
  }),

  img: Yup.string(),
});
