import { Check } from "lucide-react";
import { motion } from "framer-motion";
export const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div className="mb-8">
    <div className="flex justify-between px-2">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center"
          initial={false}
        >
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center
              ${
                index === currentStep
                  ? "bg-orange-500 text-white"
                  : index < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              backgroundColor:
                index === currentStep
                  ? "#f97316"
                  : index < currentStep
                  ? "#22c55e"
                  : "#e5e7eb",
            }}
          >
            {index < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              <span>{index + 1}</span>
            )}
          </motion.div>
          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">
            {step.title}
          </span>
        </motion.div>
      ))}
    </div>

    <div className="relative mt-4">
      <div className="absolute top-0 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded" />
      <motion.div
        className="absolute top-0 h-1 bg-orange-500 rounded"
        initial={false}
        animate={{
          width: `${(currentStep / (totalSteps - 1)) * 100}%`,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);
