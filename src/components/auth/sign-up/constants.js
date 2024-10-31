// sign-up/constants.js
import * as Yup from "yup";

export const signupSteps = [
  {
    title: "Account",
    subtitle: "Create your account credentials",
  },
  {
    title: "Personal",
    subtitle: "Tell us about yourself",
  },
  {
    title: "Verification",
    subtitle: "Verify your identity",
  },
];

export const STEP_FIELDS = {
  0: ["email", "password", "confirmPassword"],
  1: ["fullName", "phoneNumber", "birthDate"],
  2: ["cccd", "country", "address"],
};

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .required("Phone number is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  cccd: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .length(12, "CCCD must be exactly 12 digits")
    .required("CCCD is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
});
