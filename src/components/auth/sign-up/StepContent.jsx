import {
  FaBirthdayCake,
  FaEnvelope,
  FaGlobe,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { InputField } from "./InputField";
import { PasswordField } from "./PasswordField";
import { useState } from "react";

export const StepContent = ({ step, errors, touched }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  switch (step) {
    case 0:
      return (
        <>
          <InputField
            icon={<FaEnvelope />}
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            errors={errors}
            touched={touched}
          />
          <PasswordField
            label="Password"
            name="password"
            placeholder="Create a password"
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            errors={errors}
            touched={touched}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            showPassword={showConfirmPassword}
            togglePasswordVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            errors={errors}
            touched={touched}
          />
        </>
      );
    case 1:
      return (
        <>
          <InputField
            icon={<FaUser />}
            label="Full Name"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            errors={errors}
            touched={touched}
          />
          <InputField
            icon={<FaBirthdayCake />}
            label="Date of Birth"
            name="birthDate"
            type="date"
            placeholder="Select your birth date"
            errors={errors}
            touched={touched}
          />
          <InputField
            icon={<FaPhone />}
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            errors={errors}
            touched={touched}
          />
        </>
      );
    case 2:
      return (
        <>
          <InputField
            icon={<FaIdCard />}
            label="CCCD"
            name="cccd"
            type="text"
            placeholder="Enter your CCCD"
            errors={errors}
            touched={touched}
          />
          <InputField
            icon={<FaGlobe />}
            label="Country"
            name="country"
            type="text"
            placeholder="Enter your country"
            errors={errors}
            touched={touched}
          />
          <InputField
            icon={<FaMapMarkerAlt />}
            label="Address"
            name="address"
            type="text"
            placeholder="Enter your address"
            errors={errors}
            touched={touched}
          />
        </>
      );
    default:
      return null;
  }
};
