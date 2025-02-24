import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="absolute left-0 top-0 h-full bg-orange-500"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    isCompleted || isCurrent ? "#f97316" : "#fff",
                  borderColor: isCompleted || isCurrent ? "#f97316" : "#e5e7eb",
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                  relative z-10 bg-white dark:bg-gray-800`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
