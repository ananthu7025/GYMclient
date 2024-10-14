import * as yup from "yup";

export const MembershipValidationSchema = yup.object().shape({
  name: yup.string().required("Membership name is required"),
  period: yup.string().required("Period is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be a positive number"),
  signupFee: yup
    .number()
    .required("Signup fee is required")
    .positive("Signup fee must be a positive number"),
  description: yup.string().required("Description is required"),
  image: yup.mixed().required("Image is required"),
  gymId: yup.string(),
  franchiseId: yup.string(),
});
