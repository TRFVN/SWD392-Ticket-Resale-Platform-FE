import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form } from "formik";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { InputField } from "./InputField";
import { PasswordField } from "./PasswordField";
export const LoginForm = ({ onSubmit, loading, validationSchema }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="space-y-4 sm:space-y-6">
          <InputField
            icon={
              <FaEnvelope className="text-gray-500 dark:text-gray-400 w-4 h-4" />
            }
            label="Email address"
            name="email"
            type="email"
            placeholder="Enter your email"
            errors={errors}
            touched={touched}
          />

          <PasswordField
            label="Password"
            name="password"
            placeholder="Enter your password"
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
            errors={errors}
            touched={touched}
          />

          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-xs sm:text-sm text-center bg-red-100 dark:bg-red-900/30 
                          border border-red-400 dark:border-red-500/50 rounded-lg p-2.5"
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-orange-400 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-orange-400 hover:text-orange-500 
                        transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting || loading}
            className="group relative w-full flex justify-center py-2.5 px-4 
                      border border-transparent text-sm font-medium rounded-lg 
                      text-white bg-orange-400 hover:bg-orange-500 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                      transition-colors duration-200
                      disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting || loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaLock className="h-4 w-4 text-orange-300 group-hover:text-orange-400" />
                </span>
                Sign in
              </>
            )}
          </motion.button>
        </Form>
      )}
    </Formik>
  );
};
