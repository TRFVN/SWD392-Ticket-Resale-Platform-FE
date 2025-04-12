import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { InputField } from "./InputField";
import { PasswordField } from "./PasswordField";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export const LoginForm = ({ onSubmit, isSubmitting, isDarkMode = true }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isValid, dirty }) => (
        <Form className="space-y-4">
          <InputField
            icon={<FaEnvelope className="w-3.5 h-3.5" />}
            label="Email"
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            errors={errors}
            touched={touched}
            isDarkMode={isDarkMode}
          />

          <PasswordField
            label="Mật khẩu"
            name="password"
            placeholder="Nhập mật khẩu của bạn"
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            errors={errors}
            touched={touched}
            isDarkMode={isDarkMode}
          />

          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm text-center rounded-lg p-3 border-l-4 border-orange-500
                  ${
                    isDarkMode
                      ? "bg-red-900/10 text-orange-400"
                      : "bg-orange-50 text-orange-600"
                  }`}
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <Field
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className={`h-4 w-4 text-orange-500 focus:ring-orange-400 rounded 
                          transition-colors duration-200 cursor-pointer
                          ${
                            isDarkMode ? "border-gray-600" : "border-gray-300"
                          }`}
              />
              <label
                htmlFor="rememberMe"
                className={`ml-2 block text-sm cursor-pointer select-none
                  ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <Link
              to="/forgot-password"
              className={`text-sm font-medium transition-colors duration-200 hover:underline
                ${
                  isDarkMode
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-500 hover:text-orange-600"
                }`}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <motion.button
            whileHover={{
              scale: 1.01,
              boxShadow: "0 4px 10px rgba(254, 97, 0, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full flex justify-center items-center gap-2 py-3 px-6
                      text-white bg-gradient-to-r from-orange-500 to-orange-600
                      hover:from-orange-600 hover:to-orange-700
                      rounded-xl text-base font-medium shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                      transition-all duration-200
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Đăng nhập
                <HiArrowRight className="h-4 w-4 ml-1 inline-block" />
              </>
            )}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
};
