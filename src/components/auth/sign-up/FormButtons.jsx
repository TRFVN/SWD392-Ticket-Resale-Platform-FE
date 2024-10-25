import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
export const FormButtons = ({
  currentStep,
  totalSteps,
  isValid,
  dirty,
  loading,
  onBack,
  onNext,
  onSubmit,
}) => (
  <div className="flex justify-between mt-8 space-x-4">
    {currentStep > 0 && (
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="flex items-center justify-center px-6 py-3 text-sm 
          font-medium text-gray-700 dark:text-gray-200 bg-gray-100 
          dark:bg-gray-700 rounded-xl hover:bg-gray-200 
          dark:hover:bg-gray-600 transition-colors"
      >
        <FaChevronLeft className="mr-2" />
        Back
      </motion.button>
    )}

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={currentStep === totalSteps - 1 ? "submit" : "button"}
      onClick={() => {
        if (currentStep === totalSteps - 1) {
          onSubmit(); // Submit form on last step
        } else {
          onNext(); // Go to next step
        }
      }}
      disabled={loading || (!isValid && dirty)}
      className={`flex-1 flex items-center justify-center px-6 py-3 
        text-sm font-medium text-white bg-orange-500 rounded-xl 
        hover:bg-orange-600 transition-colors 
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span
          className="w-5 h-5 border-2 border-white border-t-transparent 
          rounded-full animate-spin"
        />
      ) : (
        <>
          {currentStep === totalSteps - 1 ? (
            "Complete Signup"
          ) : (
            <>
              Continue
              <FaChevronRight className="ml-2" />
            </>
          )}
        </>
      )}
    </motion.button>
  </div>
);
