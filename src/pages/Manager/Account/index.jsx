import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";

const steps = ["Organization Info", "Contact Info", "Account Info"];

const validationSchemas = [
  Yup.object({
    organizationName: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    district: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  }),
  Yup.object({
    taxId: Yup.string().required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone must be 10 digits")
      .required("Required"),
  }),
  Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain an uppercase letter")
      .matches(/[a-z]/, "Must contain a lowercase letter")
      .matches(/\d/, "Must contain a number")
      .matches(/[^a-zA-Z0-9]/, "Must contain a special character")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  }),
];

export default function OrganizationRegister() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white border-opacity-20"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-400">
          Organization Registration
        </h1>

        <div className="flex w-full mb-10 relative">
          {steps.map((label, index) => (
            <div key={index} className="flex-1 relative">
              <motion.div
                className={`flex flex-col items-center`}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: index <= step ? 1 : 0.5 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index < step
                      ? "bg-orange-500"
                      : index === step
                      ? "bg-orange-400"
                      : "bg-white bg-opacity-20"
                  }`}
                >
                  {index < step ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={
                        index === step
                          ? "text-white"
                          : "text-white text-opacity-70"
                      }
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    index <= step
                      ? "text-orange-300"
                      : "text-white text-opacity-50"
                  }`}
                >
                  {label}
                </span>
              </motion.div>

              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-full w-full h-0.5 -ml-2 -mr-2 ${
                    index < step ? "bg-orange-500" : "bg-white bg-opacity-20"
                  }`}
                  style={{ transform: "translateX(-50%)" }}
                ></div>
              )}
            </div>
          ))}
        </div>

        <Formik
          initialValues={{
            organizationName: "",
            country: "",
            city: "",
            district: "",
            address: "",
            taxId: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchemas[step]}
          onSubmit={(values) => {
            console.log("Submitted values", values);
          }}
        >
          {({ values, errors, touched, isValid, validateForm }) => (
            <Form>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {step === 0 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <Building className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">
                              Organization Name
                            </span>
                          </div>
                          <Field
                            name="organizationName"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter organization name"
                          />
                          <ErrorMessage
                            name="organizationName"
                            className="text-orange-300 text-sm mt-1 flex items-center"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">Country</span>
                          </div>
                          <Field
                            as="select"
                            name="country"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white appearance-none"
                          >
                            <option value="" className="bg-gray-800">
                              Select Country
                            </option>
                            <option value="Vietnam" className="bg-gray-800">
                              Vietnam
                            </option>
                            <option
                              value="United States"
                              className="bg-gray-800"
                            >
                              United States
                            </option>
                            <option
                              value="United Kingdom"
                              className="bg-gray-800"
                            >
                              United Kingdom
                            </option>
                            <option value="Canada" className="bg-gray-800">
                              Canada
                            </option>
                          </Field>
                          <ErrorMessage
                            name="country"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">City</span>
                          </div>
                          <Field
                            name="city"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter city"
                          />
                          <ErrorMessage
                            name="city"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">District</span>
                          </div>
                          <Field
                            name="district"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter district"
                          />
                          <ErrorMessage
                            name="district"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>

                      <div className="col-span-2">
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <MapPin className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">Address Details</span>
                          </div>
                          <Field
                            name="address"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter address details"
                          />
                          <ErrorMessage
                            name="address"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>
                    </div>

                    {(values.address ||
                      values.district ||
                      values.city ||
                      values.country) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white bg-opacity-5 p-4 rounded-lg mt-4 border border-white border-opacity-10"
                      >
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 mr-2 text-orange-400 mt-1" />
                          <div>
                            <div className="font-medium text-orange-300 mb-1">
                              Full Address Preview:
                            </div>
                            <div className="text-white">
                              {[
                                values.address,
                                values.district,
                                values.city,
                                values.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <Building className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">Tax ID</span>
                          </div>
                          <Field
                            name="taxId"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter tax ID"
                          />
                          <ErrorMessage
                            name="taxId"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block">
                          <div className="flex items-center mb-2">
                            <Phone className="w-5 h-5 mr-2 text-orange-400" />
                            <span className="text-white">Phone Number</span>
                          </div>
                          <Field
                            name="phoneNumber"
                            className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                            placeholder="Enter 10-digit phone number"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            className="text-orange-300 text-sm mt-1"
                            component={({ children }) => (
                              <div className="flex items-center mt-1">
                                <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                                <span>{children}</span>
                              </div>
                            )}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-white bg-opacity-5 p-4 rounded-lg mt-4 border border-white border-opacity-10">
                      <p className="text-orange-300 font-medium mb-2">
                        Contact Information
                      </p>
                      <p className="text-white text-sm">
                        This information will be used for official
                        communications and tax-related matters. Please ensure
                        the details are accurate.
                      </p>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-6">
                      <label className="block">
                        <div className="flex items-center mb-2">
                          <Mail className="w-5 h-5 mr-2 text-orange-400" />
                          <span className="text-white">Email</span>
                        </div>
                        <Field
                          type="email"
                          name="email"
                          className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                          placeholder="Enter email address"
                        />
                        <ErrorMessage
                          name="email"
                          className="text-orange-300 text-sm mt-1"
                          component={({ children }) => (
                            <div className="flex items-center mt-1">
                              <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                              <span>{children}</span>
                            </div>
                          )}
                        />
                      </label>

                      <label className="block">
                        <div className="flex items-center mb-2">
                          <Lock className="w-5 h-5 mr-2 text-orange-400" />
                          <span className="text-white">Password</span>
                        </div>
                        <Field
                          type="password"
                          name="password"
                          className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                          placeholder="Create password"
                        />
                        <ErrorMessage
                          name="password"
                          className="text-orange-300 text-sm mt-1"
                          component={({ children }) => (
                            <div className="flex items-center mt-1">
                              <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                              <span>{children}</span>
                            </div>
                          )}
                        />
                        <div className="text-white text-opacity-80 text-xs mt-2">
                          Password must contain at least 8 characters, including
                          uppercase, lowercase, number and special character.
                        </div>
                      </label>

                      <label className="block">
                        <div className="flex items-center mb-2">
                          <Lock className="w-5 h-5 mr-2 text-orange-400" />
                          <span className="text-white">Confirm Password</span>
                        </div>
                        <Field
                          type="password"
                          name="confirmPassword"
                          className="w-full mt-1 p-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent transition text-white"
                          placeholder="Confirm password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          className="text-orange-300 text-sm mt-1"
                          component={({ children }) => (
                            <div className="flex items-center mt-1">
                              <AlertCircle className="w-4 h-4 mr-1 text-orange-300" />
                              <span>{children}</span>
                            </div>
                          )}
                        />
                      </label>
                    </div>

                    <div className="bg-white bg-opacity-5 p-4 rounded-lg mt-4 border border-white border-opacity-10">
                      <p className="text-orange-300 font-medium mb-2">
                        Account Security
                      </p>
                      <p className="text-white text-sm">
                        Your account will be used to manage your organization.
                        Keep your credentials secure and don't share them with
                        unauthorized personnel.
                      </p>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-8">
                  {step > 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setStep((s) => Math.max(s - 1, 0))}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-white bg-opacity-10 border border-orange-400 px-5 py-3 rounded-lg text-orange-400 hover:bg-orange-400 hover:text-white transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </motion.button>
                  )}

                  {step < steps.length - 1 ? (
                    <motion.button
                      type="button"
                      onClick={async () => {
                        const formErrors = await validateForm();
                        const currentStepFields = Object.keys(
                          validationSchemas[step].fields,
                        );
                        const hasErrors = currentStepFields.some(
                          (field) => formErrors[field],
                        );

                        if (!hasErrors) {
                          setStep((s) => Math.min(s + 1, steps.length - 1));
                        } else {
                          // Touch all fields to show errors
                          currentStepFields.forEach((field) => {
                            const input = document.querySelector(
                              `[name="${field}"]`,
                            );
                            if (input) {
                              input.focus();
                              input.blur();
                            }
                          });
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-orange-400 px-5 py-3 rounded-lg text-white hover:bg-orange-500 transition-all duration-200 ml-auto"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center bg-orange-400 px-6 py-3 rounded-lg text-white hover:bg-orange-500 transition-all duration-200 ml-auto font-medium"
                    >
                      Complete Registration
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
}
