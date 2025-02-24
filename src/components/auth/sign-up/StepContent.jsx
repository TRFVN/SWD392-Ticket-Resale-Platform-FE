import React from "react";
import { Field } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { ACCOUNT_TYPES, signupSteps } from "./constants";

const FormField = ({
  name,
  type = "text",
  label,
  error,
  touched,
  ...props
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      className={`block w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 
        border transition-colors focus:outline-none focus:ring-2 
        ${
          touched && error
            ? "border-red-300 focus:border-red-300 focus:ring-red-100"
            : "border-gray-200 dark:border-gray-700 focus:border-orange-300 focus:ring-orange-100"
        }`}
      {...props}
    />
    {touched && error && (
      <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
    )}
  </div>
);

export const StepContent = ({
  step,
  accountType,
  errors,
  touched,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}) => {
  const currentStepFields = signupSteps[accountType][step].fields;

  const getFieldProps = (fieldName) => {
    const baseProps = {
      name: fieldName,
      error: errors[fieldName],
      touched: touched[fieldName],
    };

    switch (fieldName) {
      case "email":
        return {
          ...baseProps,
          type: "email",
          label: "Email Address",
          placeholder: "you@example.com",
          autoComplete: "email",
        };
      case "password":
        return {
          ...baseProps,
          type: showPassword ? "text" : "password",
          label: "Password",
          placeholder: "••••••••",
          autoComplete: "new-password",
          icon: showPassword ? EyeOff : Eye,
          onIconClick: () => setShowPassword(!showPassword),
        };
      case "confirmPassword":
        return {
          ...baseProps,
          type: showConfirmPassword ? "text" : "password",
          label: "Confirm Password",
          placeholder: "••••••••",
          autoComplete: "new-password",
          icon: showConfirmPassword ? EyeOff : Eye,
          onIconClick: () => setShowConfirmPassword(!showConfirmPassword),
        };
      case "fullName":
        return {
          ...baseProps,
          label: "Full Name",
          placeholder: "John Doe",
          autoComplete: "name",
        };
      case "organizationName":
        return {
          ...baseProps,
          label: "Organization Name",
          placeholder: "Company Inc.",
        };
      case "phoneNumber":
        return {
          ...baseProps,
          type: "tel",
          label: "Phone Number",
          placeholder: "+1234567890",
          autoComplete: "tel",
        };
      case "birthDate":
        return {
          ...baseProps,
          type: "date",
          label: "Date of Birth",
          max: new Date().toISOString().split("T")[0],
        };
      case "cccd":
        return {
          ...baseProps,
          label: "ID Number",
          placeholder: "123456789",
        };
      case "taxId":
        return {
          ...baseProps,
          label: "Tax ID",
          placeholder: "TAX123456789",
        };
      case "country":
        return {
          ...baseProps,
          label: "Country",
          placeholder: "Select your country",
          as: "select",
          children: (
            <>
              <option value="">Select a country</option>
              <option value="VN">Vietnam</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              {/* Add more countries as needed */}
            </>
          ),
        };
      case "address":
        return {
          ...baseProps,
          label: "Address",
          placeholder: "Enter your address",
          as: "textarea",
          rows: 3,
        };
      default:
        return baseProps;
    }
  };

  return (
    <div className="space-y-6">
      {currentStepFields.map((fieldName) => {
        const props = getFieldProps(fieldName);
        const { icon: Icon, onIconClick, ...fieldProps } = props;

        return (
          <div key={fieldName} className="relative">
            <FormField {...fieldProps} />
            {Icon && (
              <button
                type="button"
                onClick={onIconClick}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
