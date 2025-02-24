import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";

export const FormButtons = ({
  currentStep,
  totalSteps,
  isValid,
  dirty,
  loading,
  onBack,
  onNext,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between gap-4">
      {!isFirstStep && (
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-6 py-3 
            text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 
            rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      )}

      <motion.button
        type={isLastStep ? "submit" : "button"}
        onClick={!isLastStep ? onNext : undefined}
        disabled={loading || (!isValid && dirty)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 
          px-6 py-3 rounded-lg font-medium transition-colors
          ${
            loading || (!isValid && dirty)
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {isLastStep ? "Complete Signup" : "Continue"}
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </>
        )}
      </motion.button>
    </div>
  );
};
