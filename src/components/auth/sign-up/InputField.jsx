import { Field } from "formik";
import { motion } from "framer-motion";
export const InputField = ({
  icon,
  label,
  name,
  type,
  placeholder,
  errors,
  touched,
}) => (
  <motion.div
    className="mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
    </label>
    <div className="relative group">
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 
          text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
          border ${
            errors[name] && touched[name]
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } 
          focus:border-orange-500 dark:focus:border-orange-500 
          focus:ring-2 focus:ring-orange-500/20
          transition-all duration-200`}
      />
      {errors[name] && touched[name] && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500 dark:text-red-400"
        >
          {errors[name]}
        </motion.p>
      )}

      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </div>
  </motion.div>
);
