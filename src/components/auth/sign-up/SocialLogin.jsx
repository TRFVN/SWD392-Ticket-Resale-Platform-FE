import { motion } from "framer-motion";
import { FaFacebook, FaGoogle } from "react-icons/fa";
export const SocialLogin = () => (
  <div className="mt-8">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          Or continue with
        </span>
      </div>
    </div>

    <div className="mt-6 grid grid-cols-2 gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex justify-center items-center px-4 py-2.5 
          border border-gray-300 dark:border-gray-600 rounded-xl 
          bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors"
      >
        <FaGoogle className="w-5 h-5 text-orange-500" />
        <span className="ml-2 text-gray-700 dark:text-gray-200">Google</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex justify-center items-center px-4 py-2.5 
          border border-gray-300 dark:border-gray-600 rounded-xl 
          bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors"
      >
        <FaFacebook className="w-5 h-5 text-blue-600" />
        <span className="ml-2 text-gray-700 dark:text-gray-200">Facebook</span>
      </motion.button>
    </div>
  </div>
);
