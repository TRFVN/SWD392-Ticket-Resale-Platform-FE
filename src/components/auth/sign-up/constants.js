import * as Yup from "yup";

export const ACCOUNT_TYPES = {
  INDIVIDUAL: "individual",
  ORGANIZATION: "organization",
};

export const signupSteps = {
  [ACCOUNT_TYPES.INDIVIDUAL]: [
    {
      title: "Create Account",
      subtitle: "Start by setting up your login credentials",
      fields: ["email", "password", "confirmPassword"],
    },
    {
      title: "Personal Information",
      subtitle: "Tell us about yourself",
      fields: ["fullName", "phoneNumber", "birthDate"],
    },
    {
      title: "Additional Details",
      subtitle: "Complete your profile",
      fields: ["cccd", "country", "address"],
    },
  ],
  [ACCOUNT_TYPES.ORGANIZATION]: [
    {
      title: "Create Account",
      subtitle: "Start by setting up your organization account",
      fields: ["email", "password", "confirmPassword"],
    },
    {
      title: "Organization Details",
      subtitle: "Tell us about your organization",
      fields: ["organizationName", "phoneNumber", "taxId"],
    },
    {
      title: "Location Information",
      subtitle: "Where is your organization based?",
      fields: ["country", "address"],
    },
  ],
};

const passwordRules = {
  matches: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
  min: 8,
  max: 50,
};

const baseValidationSchema = {
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(
      passwordRules.min,
      `Password must be at least ${passwordRules.min} characters`,
    )
    .max(
      passwordRules.max,
      `Password must be less than ${passwordRules.max} characters`,
    )
    .matches(
      passwordRules.matches,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  phoneNumber: Yup.string()
    .matches(/^(\+?[0-9])\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
};

export const validationSchemas = {
  [ACCOUNT_TYPES.INDIVIDUAL]: Yup.object({
    ...baseValidationSchema,
    fullName: Yup.string()
      .min(2, "Name is too short")
      .max(50, "Name is too long")
      .required("Full name is required"),
    birthDate: Yup.date()
      .max(new Date(), "Birth date cannot be in the future")
      .required("Birth date is required"),
    cccd: Yup.string()
      .matches(/^\d{9,12}$/, "Invalid ID number")
      .required("ID number is required"),
  }),
  [ACCOUNT_TYPES.ORGANIZATION]: Yup.object({
    ...baseValidationSchema,
    organizationName: Yup.string()
      .min(2, "Organization name is too short")
      .max(100, "Organization name is too long")
      .required("Organization name is required"),
    taxId: Yup.string()
      .matches(/^[0-9A-Z]{10,15}$/, "Invalid tax ID")
      .required("Tax ID is required"),
  }),
};

export const initialValues = {
  [ACCOUNT_TYPES.INDIVIDUAL]: {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    cccd: "",
    country: "",
    address: "",
  },
  [ACCOUNT_TYPES.ORGANIZATION]: {
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    phoneNumber: "",
    taxId: "",
    country: "",
    address: "",
  },
};
