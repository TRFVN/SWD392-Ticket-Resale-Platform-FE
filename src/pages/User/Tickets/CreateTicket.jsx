import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllEventApi } from "../../../services/eventApi";
import { getAllCategoryApi } from "../../../services/categoryApi";
import { postTicketApi, uploadTicketApi } from "../../../services/ticket";
import { useSelector } from "react-redux";

// Import icons - using Lucide but this could be switched to any icon set
import {
  Upload,
  Ticket,
  Tag,
  AlertCircle,
  Check,
  ChevronDown,
  Camera,
  X,
  ArrowRight,
  Image as ImageIcon,
  ArrowLeft,
  Info,
  LayoutGrid,
  Search,
  Calendar,
  Sparkles,
  Edit3,
  Map,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";

const CreateTicket = () => {
  // Core state
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [openEventList, setOpenEventList] = useState(false);
  const [openCategoryList, setOpenCategoryList] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  // Enhanced UX state
  const [activeView, setActiveView] = useState("form"); // form, preview, or card
  const [currentStep, setCurrentStep] = useState(0);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showPremiumTip, setShowPremiumTip] = useState(false);
  const [ticketCity, setTicketCity] = useState("Ho Chi Minh City");
  const [ticketQuantity, setTicketQuantity] = useState(100);

  // Refs
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const eventRef = useRef(null);
  const categoryRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // Steps for the wizard interface
  const steps = [
    {
      id: "basic",
      title: "Basic Information",
      icon: <Ticket className="h-5 w-5" />,
      description: "Start with the essential details about your ticket",
    },
    {
      id: "event",
      title: "Event & Category",
      icon: <Calendar className="h-5 w-5" />,
      description: "Connect your ticket to an event and category",
    },
    {
      id: "price",
      title: "Pricing",
      icon: <Tag className="h-5 w-5" />,
      description: "Set an attractive price point for your ticket",
    },
    {
      id: "image",
      title: "Visual Appeal",
      icon: <ImageIcon className="h-5 w-5" />,
      description: "Make your ticket stand out with a captivating image",
    },
  ];

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, categoryData] = await Promise.all([
          getAllEventApi(),
          getAllCategoryApi(),
        ]);

        if (eventData) setEventList(eventData);
        if (categoryData) setCategoryList(categoryData);
      } catch (error) {
        toast.error("Failed to load necessary data");
        console.error("Data loading error:", error);
      }
    };

    fetchData();

    // Show premium tip after 5 seconds if user is still on the first step
    const tipTimer = setTimeout(() => {
      if (currentStep === 0) setShowPremiumTip(true);
    }, 5000);

    return () => clearTimeout(tipTimer);
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventRef.current && !eventRef.current.contains(event.target)) {
        setOpenEventList(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setOpenCategoryList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Drag and drop handlers for image upload
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDraggingImage(true);
    };

    const handleDragLeave = () => {
      setIsDraggingImage(false);
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      setIsDraggingImage(false);

      const file = e.dataTransfer.files[0];
      if (file) await processImageFile(file);
    };

    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
    dropZone.addEventListener("drop", handleDrop);

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Process the image file (both for drag & drop and file input)
  const processImageFile = async (file) => {
    if (!file) return;

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Upload logic
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(1); // Start progress
      const response = await uploadTicketApi(formData, setUploadProgress);

      if (response?.data?.result) {
        setImageUrl(response.data.result);
        formik.setFieldValue("imageUrl", response.data.result);

        // Auto advance to next step if this is the last step
        if (currentStep === 3) {
          setTimeout(() => {
            setShowCompletion(true);
          }, 800);
        }

        toast.success("Image uploaded successfully", {
          icon: "🖼️",
          style: { borderRadius: "10px", background: "#1f2937", color: "#fff" },
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again");
      console.error("Image upload error:", error);
    } finally {
      setUploadProgress(0);
    }
  };

  // Handle file input change
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    await processImageFile(file);
  };

  // Form validation with Formik
  const formik = useFormik({
    initialValues: {
      ticketName: "",
      ticketDescription: "",
      eventId: "",
      eventName: "",
      categoryId: "",
      categoryName: "",
      imageUrl: "",
      serialNumber: "",
      ticketPrice: "",
      city: "Ho Chi Minh City",
      quantity: 100,
    },
    validationSchema: Yup.object({
      ticketName: Yup.string()
        .required("Ticket Name is required")
        .min(10, "Ticket Name must be at least 10 characters"),
      ticketDescription: Yup.string()
        .required("Ticket Description is required")
        .min(10, "Ticket Description must be at least 10 characters"),
      serialNumber: Yup.string()
        .required("Serial Number is required")
        .min(10, "Serial Number must be at least 10 characters"),
      ticketPrice: Yup.number()
        .required("Ticket Price is required")
        .min(1, "Ticket Price must be greater than 0"),
      eventId: Yup.string().required("Event selection is required"),
      categoryId: Yup.string().required("Category selection is required"),
      imageUrl: Yup.string().required("Image upload is required"),
      city: Yup.string().required("City is required"),
      quantity: Yup.number().required("Quantity is required").min(1),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        const response = await postTicketApi(values);

        if (response) {
          // Show successful animation before navigating
          setShowCompletion(true);

          setTimeout(() => {
            resetForm();
            setImageUrl("");
            navigate("/tickets");
            toast.success(
              "Ticket created successfully! It's now awaiting review.",
              {
                icon: "🎫",
                style: {
                  borderRadius: "10px",
                  background: "#1f2937",
                  color: "#fff",
                },
              },
            );
          }, 2000);
        } else {
          throw new Error("Failed to create ticket");
        }
      } catch (error) {
        toast.error("Failed to create ticket. Please try again.");
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Get category badge color based on category name
  const getCategoryBadgeColor = (categoryName) => {
    if (!categoryName) return "";

    switch (categoryName) {
      case "VIP":
        return isDarkMode
          ? "bg-purple-800/30 text-purple-400"
          : "bg-purple-100 text-purple-600";
      case "Standard":
        return isDarkMode
          ? "bg-blue-800/30 text-blue-400"
          : "bg-blue-100 text-blue-600";
      default:
        return isDarkMode
          ? "bg-green-800/30 text-green-400"
          : "bg-green-100 text-green-600";
    }
  };

  // Check if a section is complete for progress tracking
  const isSectionComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Basic info
        return (
          formik.values.ticketName &&
          formik.values.serialNumber &&
          formik.values.ticketDescription &&
          !formik.errors.ticketName &&
          !formik.errors.serialNumber &&
          !formik.errors.ticketDescription
        );
      case 1: // Event & Category
        return (
          formik.values.categoryId &&
          formik.values.eventId &&
          !formik.errors.categoryId &&
          !formik.errors.eventId
        );
      case 2: // Price
        return formik.values.ticketPrice && !formik.errors.ticketPrice;
      case 3: // Image
        return formik.values.imageUrl && !formik.errors.imageUrl;
      default:
        return false;
    }
  };

  // Calculate overall completion percentage
  const calculateProgress = () => {
    let completed = 0;
    for (let i = 0; i < steps.length; i++) {
      if (isSectionComplete(i)) completed++;
    }
    return Math.round((completed / steps.length) * 100);
  };

  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (isSectionComplete(currentStep)) {
      // All steps complete, show completion animation
      setShowCompletion(true);
    }
  };

  // Navigate to the previous step
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  // Get gradient color based on progress
  const getProgressGradient = () => {
    const progress = calculateProgress();
    if (progress <= 25) return "from-orange-400 to-red-500";
    if (progress <= 50) return "from-orange-400 to-orange-500";
    if (progress <= 75) return "from-orange-400 to-orange-600";
    return "from-orange-500 to-orange-600";
  };

  // Render the specific form step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="basic-info"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="ticketName"
                className="block text-sm font-medium text-white mb-2"
              >
                Ticket Name
              </label>
              <input
                id="ticketName"
                name="ticketName"
                placeholder="Enter a descriptive name for your ticket"
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl ${
                  formik.touched.ticketName && formik.errors.ticketName
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.ticketName
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } ${
                  isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                } transition-all`}
                value={formik.values.ticketName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.ticketName && formik.errors.ticketName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.ticketName}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="serialNumber"
                className="block text-sm font-medium text-white mb-2"
              >
                Serial Number
              </label>
              <input
                id="serialNumber"
                name="serialNumber"
                placeholder="Enter a unique identifier for this ticket"
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl ${
                  formik.touched.serialNumber && formik.errors.serialNumber
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.serialNumber
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } ${
                  isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                } transition-all`}
                value={formik.values.serialNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.serialNumber && formik.errors.serialNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.serialNumber}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-white mb-2"
                >
                  City
                </label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <input
                id="city"
                name="city"
                placeholder="Enter city"
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl ${
                  formik.touched.city && formik.errors.city
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.city
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } ${
                  isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                } transition-all`}
                value={formik.values.city}
                onChange={(e) => {
                  formik.handleChange(e);
                  setTicketCity(e.target.value);
                }}
                onBlur={formik.handleBlur}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex justify-between">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Quantity Available
                </label>
                <span className="text-xs text-gray-400">Required</span>
              </div>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="Enter quantity"
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl ${
                  formik.touched.quantity && formik.errors.quantity
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.quantity
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } ${
                  isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                } transition-all`}
                value={formik.values.quantity}
                onChange={(e) => {
                  formik.handleChange(e);
                  setTicketQuantity(e.target.value);
                }}
                onBlur={formik.handleBlur}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="ticketDescription"
                className="block text-sm font-medium text-white mb-2"
              >
                Ticket Description
              </label>
              <textarea
                id="ticketDescription"
                name="ticketDescription"
                placeholder="Describe what this ticket offers..."
                rows="4"
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl ${
                  formik.touched.ticketDescription &&
                  formik.errors.ticketDescription
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.ticketDescription
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } ${
                  isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                } transition-all`}
                value={formik.values.ticketDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.ticketDescription &&
                formik.errors.ticketDescription && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    {formik.errors.ticketDescription}
                  </motion.p>
                )}
              <p className="mt-2 text-xs text-gray-500">
                Tip: A detailed description helps potential buyers understand
                what they&aposre getting.
              </p>
            </motion.div>

            {showPremiumTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-gradient-to-r from-orange-600/20 to-orange-500/20 border border-orange-500/30 rounded-xl"
              >
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-300 font-medium">
                      Pro Tip
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tickets with detailed descriptions and high-quality images
                      sell 3x faster than those without.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPremiumTip(false)}
                    className="ml-auto text-gray-500 hover:text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="event-category"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="relative"
              ref={categoryRef}
            >
              <label className="block text-sm font-medium text-white mb-2">
                Category
              </label>
              <button
                type="button"
                onClick={() => {
                  setOpenCategoryList(!openCategoryList);
                  setOpenEventList(false);
                }}
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl flex items-center justify-between ${
                  formik.touched.categoryId && formik.errors.categoryId
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.categoryId
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } transition-all`}
              >
                <div className="flex items-center">
                  {formik.values.categoryName && (
                    <span
                      className={`mr-2 px-2 py-1 rounded-full text-xs ${getCategoryBadgeColor(
                        formik.values.categoryName,
                      )}`}
                    >
                      {formik.values.categoryName}
                    </span>
                  )}
                  <span
                    className={
                      formik.values.categoryName
                        ? isDarkMode
                          ? "text-white"
                          : "text-gray-900"
                        : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }
                  >
                    {formik.values.categoryName
                      ? "Selected"
                      : "Select category"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } transition-transform ${
                    openCategoryList ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openCategoryList && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute z-10 mt-1 w-full ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } rounded-xl shadow-xl overflow-hidden`}
                  >
                    <div
                      className={`p-2 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <Search
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Search categories..."
                          className={`w-full py-2 pl-10 pr-4 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-100 border-gray-200 text-gray-900"
                          } border rounded-lg text-sm focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {categoryList.length > 0 ? (
                        categoryList.map((category) => (
                          <button
                            key={category.categoryId}
                            type="button"
                            className={`w-full px-4 py-2.5 text-left flex items-center ${
                              formik.values.categoryId === category.categoryId
                                ? isDarkMode
                                  ? "bg-orange-600/20 text-orange-400"
                                  : "bg-orange-100 text-orange-600"
                                : isDarkMode
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              formik.setFieldValue(
                                "categoryId",
                                category.categoryId,
                              );
                              formik.setFieldValue(
                                "categoryName",
                                category.categoryName,
                              );
                              setOpenCategoryList(false);
                            }}
                          >
                            <Tag
                              className={`h-4 w-4 mr-2 ${
                                formik.values.categoryId === category.categoryId
                                  ? "text-orange-500"
                                  : isDarkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            />
                            <span
                              className={
                                getCategoryBadgeColor(category.categoryName) +
                                " px-2 py-0.5 rounded-full text-xs mr-2"
                              }
                            >
                              {category.categoryName}
                            </span>
                            <span>{category.categoryName}</span>
                            {formik.values.categoryId ===
                              category.categoryId && (
                              <Check className="ml-auto h-4 w-4 text-orange-500" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-center">
                          No categories available
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {formik.touched.categoryId && formik.errors.categoryId && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.categoryId}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
              ref={eventRef}
            >
              <label className="block text-sm font-medium text-white mb-2">
                Event
              </label>
              <button
                type="button"
                onClick={() => {
                  setOpenEventList(!openEventList);
                  setOpenCategoryList(false);
                }}
                className={`w-full p-3 ${
                  isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                } border rounded-xl flex items-center justify-between ${
                  formik.touched.eventId && formik.errors.eventId
                    ? "border-red-500 ring-1 ring-red-500"
                    : formik.values.eventId
                    ? "border-green-500 ring-1 ring-green-500"
                    : isDarkMode
                    ? "border-gray-700"
                    : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } transition-all`}
              >
                <span
                  className={
                    formik.values.eventName
                      ? isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                      : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                >
                  {formik.values.eventName || "Select event"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  } transition-transform ${openEventList ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {openEventList && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute z-10 mt-1 w-full ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } border ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    } rounded-xl shadow-xl overflow-hidden`}
                  >
                    <div
                      className={`p-2 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="relative">
                        <Search
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          placeholder="Search events..."
                          className={`w-full py-2 pl-10 pr-4 ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-gray-100 border-gray-200 text-gray-900"
                          } border rounded-lg text-sm focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {eventList.length > 0 ? (
                        eventList.map((event) => (
                          <button
                            key={event.eventId}
                            type="button"
                            className={`w-full px-4 py-2.5 text-left flex items-center ${
                              formik.values.eventId === event.eventId
                                ? isDarkMode
                                  ? "bg-orange-600/20 text-orange-400"
                                  : "bg-orange-100 text-orange-600"
                                : isDarkMode
                                ? "text-white hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              formik.setFieldValue("eventId", event.eventId);
                              formik.setFieldValue(
                                "eventName",
                                event.eventName,
                              );
                              setOpenEventList(false);
                            }}
                          >
                            <Calendar
                              className={`h-4 w-4 mr-2 ${
                                formik.values.eventId === event.eventId
                                  ? "text-orange-500"
                                  : isDarkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            />
                            <span>{event.eventName}</span>
                            {formik.values.eventId === event.eventId && (
                              <Check className="ml-auto h-4 w-4 text-orange-500" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 text-center">
                          No events available
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {formik.touched.eventId && formik.errors.eventId && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.eventId}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`mt-4 p-4 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-100 border-gray-200"
              } border rounded-xl`}
            >
              <p className="text-sm text-gray-400 flex items-start">
                <Info className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                Linking your ticket to the right event and category helps
                potential buyers discover it more easily.
              </p>
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="pricing"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="ticketPrice"
                className="block text-sm font-medium text-white mb-2"
              >
                Ticket Price (VND)
              </label>
              <div className="relative">
                <input
                  id="ticketPrice"
                  name="ticketPrice"
                  placeholder="Enter price"
                  className={`w-full p-3 ${
                    isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
                  } border rounded-xl ${
                    formik.touched.ticketPrice && formik.errors.ticketPrice
                      ? "border-red-500 ring-1 ring-red-500"
                      : formik.values.ticketPrice
                      ? "border-green-500 ring-1 ring-green-500"
                      : isDarkMode
                      ? "border-gray-700"
                      : "border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } ${
                    isDarkMode ? "placeholder-gray-500" : "placeholder-gray-400"
                  } transition-all pr-12`}
                  value={
                    formik.values.ticketPrice
                      ? Number(formik.values.ticketPrice).toLocaleString(
                          "vi-VN",
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    if (/^\d*$/.test(rawValue)) {
                      formik.setFieldValue("ticketPrice", rawValue);
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                  ₫
                </div>
              </div>
              {formik.touched.ticketPrice && formik.errors.ticketPrice && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.ticketPrice}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <div
                className={`group p-4 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-green-900/20 to-green-800/10 border-green-800/30"
                    : "from-green-100 to-green-50 border-green-200"
                } border rounded-xl cursor-pointer ${
                  isDarkMode
                    ? "hover:from-green-800/30 hover:to-green-700/20"
                    : "hover:from-green-200 hover:to-green-100"
                } transition-all`}
              >
                <div className="flex items-start mb-2">
                  <div
                    className={`p-2 ${
                      isDarkMode ? "bg-green-500/20" : "bg-green-500/10"
                    } rounded-lg`}
                  >
                    <Tag className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h4
                      className={`${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      } font-medium group-hover:${
                        isDarkMode ? "text-green-300" : "text-green-700"
                      }`}
                    >
                      Economy
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">Basic access</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Best for standard tickets
                </p>
              </div>

              <div
                className={`group p-4 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-blue-900/20 to-blue-800/10 border-blue-800/30"
                    : "from-blue-100 to-blue-50 border-blue-200"
                } border rounded-xl cursor-pointer ${
                  isDarkMode
                    ? "hover:from-blue-800/30 hover:to-blue-700/20"
                    : "hover:from-blue-200 hover:to-blue-100"
                } transition-all`}
              >
                <div className="flex items-start mb-2">
                  <div
                    className={`p-2 ${
                      isDarkMode ? "bg-blue-500/20" : "bg-blue-500/10"
                    } rounded-lg`}
                  >
                    <Tag className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4
                      className={`${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      } font-medium group-hover:${
                        isDarkMode ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      Standard
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Enhanced experience
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Best for regular tickets
                </p>
              </div>

              <div
                className={`group p-4 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-purple-900/20 to-purple-800/10 border-purple-800/30"
                    : "from-purple-100 to-purple-50 border-purple-200"
                } border rounded-xl cursor-pointer ${
                  isDarkMode
                    ? "hover:from-purple-800/30 hover:to-purple-700/20"
                    : "hover:from-purple-200 hover:to-purple-100"
                } transition-all`}
              >
                <div className="flex items-start mb-2">
                  <div
                    className={`p-2 ${
                      isDarkMode ? "bg-purple-500/20" : "bg-purple-500/10"
                    } rounded-lg`}
                  >
                    <Tag className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <h4
                      className={`${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      } font-medium group-hover:${
                        isDarkMode ? "text-purple-300" : "text-purple-700"
                      }`}
                    >
                      VIP
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Premium experience
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Best for premium packages
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`mt-4 p-4 ${
                isDarkMode
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-100 border-gray-200"
              } border rounded-xl`}
            >
              <h4
                className={`font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mb-2 flex items-center`}
              >
                <Info className="h-4 w-4 text-orange-500 mr-2" />
                Pricing Tips
              </h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-400 flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Consider the value provided and market rates for similar
                  tickets
                </li>
                <li className="text-sm text-gray-400 flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Early bird prices can help generate initial sales momentum
                </li>
                <li className="text-sm text-gray-400 flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Include all taxes and fees in your listed price for
                  transparency
                </li>
              </ul>
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="image-upload"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">
                  Ticket Image
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      formik.setFieldValue("imageUrl", "");
                    }}
                    className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </button>
                )}
              </div>

              <div
                ref={dropZoneRef}
                className={`relative rounded-xl overflow-hidden ${
                  formik.touched.imageUrl && formik.errors.imageUrl && !imageUrl
                    ? "ring-2 ring-red-500"
                    : isDraggingImage
                    ? "ring-2 ring-orange-500"
                    : ""
                }`}
              >
                {imageUrl ? (
                  <div className="group relative">
                    <img
                      src={imageUrl}
                      alt="Ticket preview"
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm hover:bg-white/30 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-64 md:h-80 flex flex-col items-center justify-center border-2 border-dashed rounded-xl ${
                      isDraggingImage
                        ? "border-orange-500 bg-orange-500/10"
                        : formik.touched.imageUrl && formik.errors.imageUrl
                        ? "border-red-500 bg-red-500/5"
                        : isDarkMode
                        ? "border-gray-700 bg-gray-800/50"
                        : "border-gray-300 bg-gray-100"
                    } transition-colors`}
                  >
                    {uploadProgress > 0 ? (
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-3"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#f97316"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="251.2"
                            strokeDashoffset={
                              251.2 - (uploadProgress / 100) * 251.2
                            }
                            transform="rotate(-90 50 50)"
                          />
                          <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isDarkMode ? "white" : "#4b5563"}
                            fontSize="16"
                            fontWeight="bold"
                          >
                            {uploadProgress}%
                          </text>
                        </svg>
                        <p className="text-orange-400">
                          Uploading your image...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Camera
                          className={`h-12 w-12 ${
                            isDarkMode ? "text-gray-600" : "text-gray-400"
                          } mb-2`}
                        />
                        <p className="text-gray-400 mb-2">
                          Drag and drop your image here
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                          Support JPG, PNG or WEBP (max. 5MB)
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors flex items-center"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Browse Files
                        </button>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadProgress > 0}
                />
              </div>

              {formik.touched.imageUrl && formik.errors.imageUrl && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-500 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                  {formik.errors.imageUrl}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div
                className={`p-4 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                } border rounded-xl`}
              >
                <h4
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2 flex items-center`}
                >
                  <Camera className="h-4 w-4 text-orange-500 mr-2" />
                  Image Tips
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-400 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Use high-quality, well-lit images
                  </li>
                  <li className="text-sm text-gray-400 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Optimal aspect ratio is 16:9 or 3:2
                  </li>
                  <li className="text-sm text-gray-400 flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Avoid using text in images as it may be hard to read on
                    small screens
                  </li>
                </ul>
              </div>

              <div
                className={`p-4 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-gray-100 border-gray-200"
                } border rounded-xl`}
              >
                <h4
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } mb-2 flex items-center`}
                >
                  <Sparkles className="h-4 w-4 text-orange-500 mr-2" />
                  Why Images Matter
                </h4>
                <p className="text-sm text-gray-400">
                  Tickets with compelling images get 2-3x more views and sell
                  faster. Create a visual connection with potential buyers.
                </p>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Render enhanced ticket card preview
  const renderTicketCardPreview = () => {
    return (
      <div
        className={`rounded-2xl overflow-hidden border shadow-sm
        ${
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="p-5">
          {/* Ticket Header */}
          <div className="flex justify-between items-start mb-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium bg-opacity-20 ${getCategoryBadgeColor(
                formik.values.categoryName,
              )}`}
            >
              {formik.values.categoryName || "Category"}
            </div>
            <div
              className={`font-bold text-lg ${
                isDarkMode ? "text-orange-400" : "text-orange-500"
              }`}
            >
              {formik.values.ticketPrice
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(formik.values.ticketPrice)
                : "₫0"}
            </div>
          </div>

          {/* Ticket Name */}
          <h3
            className={`text-lg font-bold mb-2 transition-colors line-clamp-2
            ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            {formik.values.ticketName || "Ticket Name"}
          </h3>

          {/* Event Name */}
          <p
            className={`mb-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {formik.values.eventName || "Event Name"}
          </p>

          {/* Ticket Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Map
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <span
                className={`line-clamp-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {formik.values.city || "City"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Tag
                className={`w-4 h-4 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <span
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {formik.values.quantity || "0"} available
              </span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div
          className={`flex border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors
              ${
                isDarkMode
                  ? "text-white hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            View Details
          </button>
          <div
            className={`w-px ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
          ></div>
          <button className="flex-1 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-black"
          : "bg-gradient-to-b from-gray-50 via-gray-50 to-white"
      } ${isDarkMode ? "text-white" : "text-gray-900"} overflow-hidden`}
    >
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
                patternContentUnits="userSpaceOnUse"
              >
                <circle
                  id="pattern-circle"
                  cx="10"
                  cy="10"
                  r="1.6257413380501518"
                  fill={isDarkMode ? "#888" : "#ccc"}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4 shadow-lg"
            >
              <Ticket className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold"
              >
                Create New Ticket
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={isDarkMode ? "text-gray-400" : "text-gray-600"}
              >
                Craft an engaging ticket that sells
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-3"
          >
            <button
              type="button"
              onClick={() =>
                setActiveView(activeView === "form" ? "preview" : "form")
              }
              className={`${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
              } px-4 py-2 rounded-lg flex items-center transition-colors`}
            >
              {activeView === "form" ? (
                <>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  <span>Edit</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveView(activeView === "card" ? "form" : "card")
              }
              className={`${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
              } px-4 py-2 rounded-lg flex items-center transition-colors`}
            >
              {activeView === "card" ? (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Back</span>
                </>
              ) : (
                <>
                  <Ticket className="h-4 w-4 mr-2" />
                  <span>Card View</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Progress bar and steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Step {currentStep + 1} of {steps.length}
            </p>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {calculateProgress()}% complete
            </p>
          </div>

          <div
            className={`h-2 w-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            } rounded-full overflow-hidden`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full bg-gradient-to-r ${getProgressGradient()}`}
            />
          </div>

          <div className="flex justify-between mt-4 relative">
            <div
              className={`absolute top-[9px] left-0 right-0 h-0.5 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              } -z-10`}
            />

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center justify-center h-5 w-5 rounded-full ${
                    currentStep === index
                      ? "bg-orange-500 text-white"
                      : isSectionComplete(index)
                      ? "bg-green-500 text-white"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-500"
                      : "bg-gray-200 text-gray-400"
                  } ${
                    index < currentStep
                      ? isDarkMode
                        ? "hover:bg-orange-600"
                        : "hover:bg-orange-600"
                      : ""
                  } transition-colors mb-2`}
                >
                  {isSectionComplete(index) ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-[10px]">{index + 1}</span>
                  )}
                </button>
                <span
                  className={`text-xs ${
                    currentStep === index
                      ? "text-orange-500 font-medium"
                      : isSectionComplete(index)
                      ? "text-green-500"
                      : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-${activeView === "form" ? "2" : "3"}`}>
            <AnimatePresence mode="wait">
              {activeView === "form" && (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${
                    isDarkMode
                      ? "bg-gray-900/80 backdrop-blur-sm border-gray-800"
                      : "bg-white/90 backdrop-blur-sm border-gray-200"
                  } border rounded-xl p-6 shadow-xl`}
                >
                  <form onSubmit={formik.handleSubmit}>
                    {/* Step content */}
                    {renderStepContent()}

                    {/* Navigation buttons */}
                    <motion.div
                      className="flex justify-between mt-10"
                      variants={itemVariants}
                    >
                      <button
                        type="button"
                        onClick={goToPrevStep}
                        className={`px-4 py-2 rounded-lg flex items-center ${
                          currentStep === 0
                            ? "opacity-0 pointer-events-none"
                            : isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        } transition-colors`}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </button>

                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={goToNextStep}
                          disabled={!isSectionComplete(currentStep)}
                          className={`px-6 py-2 rounded-lg flex items-center ${
                            isSectionComplete(currentStep)
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          } transition-colors`}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!formik.isValid || isSubmitting}
                          className={`px-6 py-2 rounded-lg flex items-center ${
                            formik.isValid && !isSubmitting
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          } transition-colors`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            <>
                              Create Ticket
                              <Check className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </button>
                      )}
                    </motion.div>
                  </form>
                </motion.div>
              )}

              {activeView === "preview" && (
                <motion.div
                  key="preview-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${
                    isDarkMode
                      ? "bg-gray-900/80 backdrop-blur-sm border-gray-800"
                      : "bg-white/90 backdrop-blur-sm border-gray-200"
                  } border rounded-xl p-6 shadow-xl`}
                >
                  <h2
                    className={`text-xl font-semibold mb-6 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <LayoutGrid className="h-5 w-5 text-orange-500 mr-2" />
                    Ticket Preview
                  </h2>

                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden relative mb-6">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Ticket preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-16 w-16 text-gray-700" />
                      </div>
                    )}

                    {/* Overlay with ticket info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {formik.values.ticketName || "Ticket Name"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {formik.values.eventName && (
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Calendar className="h-4 w-4 text-orange-400 mr-2" />
                            <span className="text-sm text-gray-200">
                              {formik.values.eventName}
                            </span>
                          </div>
                        )}

                        {formik.values.categoryName && (
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Tag className="h-4 w-4 text-purple-400 mr-2" />
                            <span
                              className={`text-sm px-2 py-0.5 rounded-full ${getCategoryBadgeColor(
                                formik.values.categoryName,
                              )}`}
                            >
                              {formik.values.categoryName}
                            </span>
                          </div>
                        )}

                        {formik.values.ticketPrice && (
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <span className="text-sm font-medium text-orange-400">
                              {Number(formik.values.ticketPrice).toLocaleString(
                                "vi-VN",
                              )}{" "}
                              ₫
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-300 line-clamp-3">
                        {formik.values.ticketDescription ||
                          "Your ticket description will appear here. Add details about what this ticket offers to entice potential buyers."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3
                        className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Details
                      </h3>

                      <div
                        className={`${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-700"
                            : "bg-gray-100/70 border-gray-200"
                        } rounded-lg p-4 border`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Event
                          </span>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formik.values.eventName || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Category
                          </span>
                          <span
                            className={`text-sm ${
                              formik.values.categoryName
                                ? getCategoryBadgeColor(
                                    formik.values.categoryName,
                                  ) + " px-2 py-0.5 rounded-full text-xs"
                                : isDarkMode
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {formik.values.categoryName || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            City
                          </span>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formik.values.city || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Serial
                          </span>
                          <span
                            className={`text-sm font-mono ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formik.values.serialNumber || "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Price
                          </span>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-orange-400" : "text-orange-500"
                            } font-medium`}
                          >
                            {formik.values.ticketPrice
                              ? `${Number(
                                  formik.values.ticketPrice,
                                ).toLocaleString("vi-VN")} ₫`
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3
                        className={`font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Status
                      </h3>

                      <div
                        className={`${
                          isDarkMode
                            ? "bg-gray-800/50 border-gray-700"
                            : "bg-gray-100/70 border-gray-200"
                        } rounded-lg p-4 border`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Form Completion
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              calculateProgress() === 100
                                ? "text-green-500"
                                : "text-orange-500"
                            }`}
                          >
                            {calculateProgress()}%
                          </span>
                        </div>

                        <div
                          className={`h-1.5 w-full ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          } rounded-full overflow-hidden mb-4`}
                        >
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressGradient()}`}
                            style={{ width: `${calculateProgress()}%` }}
                          />
                        </div>

                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={() => setActiveView("form")}
                            className="text-xs text-orange-500 hover:text-orange-400 flex items-center"
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit Details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                formik.isValid &&
                                !isSubmitting &&
                                calculateProgress() === 100
                              ) {
                                formik.handleSubmit();
                              }
                            }}
                            disabled={
                              !formik.isValid ||
                              isSubmitting ||
                              calculateProgress() < 100
                            }
                            className={`text-xs ${
                              formik.isValid &&
                              !isSubmitting &&
                              calculateProgress() === 100
                                ? "text-green-500 hover:text-green-400"
                                : "text-gray-500 cursor-not-allowed"
                            } flex items-center`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Submit Ticket
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">{renderTicketCardPreview()}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "card" && (
                <motion.div
                  key="card-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <p
                    className={`mb-6 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    This is how your ticket will appear in the listings:
                  </p>

                  <div className="max-w-sm w-full mb-8">
                    {renderTicketCardPreview()}
                  </div>

                  <div className="mt-8 flex flex-col items-center">
                    <p
                      className={`text-center max-w-md mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      This is how your ticket will appear to buyers. Continue
                      editing or submit when you&aposre ready.
                    </p>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setActiveView("form")}
                        className={`px-6 py-2.5 ${
                          isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                        } rounded-lg flex items-center transition-colors`}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Continue Editing
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            formik.isValid &&
                            !isSubmitting &&
                            calculateProgress() === 100
                          ) {
                            formik.handleSubmit();
                          }
                        }}
                        disabled={
                          !formik.isValid ||
                          isSubmitting ||
                          calculateProgress() < 100
                        }
                        className={`px-6 py-2.5 rounded-lg flex items-center ${
                          formik.isValid &&
                          !isSubmitting &&
                          calculateProgress() === 100
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } transition-colors`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            Submit Ticket
                            <Check className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {activeView === "form" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 hidden lg:block"
            >
              <div className="sticky top-8">
                <div
                  className={`${
                    isDarkMode
                      ? "bg-gray-900/80 backdrop-blur-sm border-gray-800"
                      : "bg-white backdrop-blur-sm border-gray-200"
                  } border rounded-xl overflow-hidden shadow-xl`}
                >
                  <h3
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } p-4 border-b ${
                      isDarkMode ? "border-gray-800" : "border-gray-100"
                    }`}
                  >
                    Ticket Preview
                  </h3>
                  {renderTicketCardPreview()}
                </div>

                <div
                  className={`mt-6 ${
                    isDarkMode
                      ? "bg-gray-900/80 backdrop-blur-sm border-gray-800"
                      : "bg-white backdrop-blur-sm border-gray-200"
                  } border rounded-xl p-5`}
                >
                  <h3
                    className={`font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    Completion Status
                  </h3>

                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center mr-3 ${
                            isSectionComplete(index)
                              ? "bg-green-500"
                              : currentStep === index
                              ? "bg-orange-500"
                              : isDarkMode
                              ? "bg-gray-700"
                              : "bg-gray-200"
                          }`}
                        >
                          {isSectionComplete(index) ? (
                            <Check className="h-3 w-3 text-white" />
                          ) : (
                            <span className="text-[10px] text-white">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-sm ${
                                currentStep === index
                                  ? isDarkMode
                                    ? "text-white font-medium"
                                    : "text-gray-900 font-medium"
                                  : isSectionComplete(index)
                                  ? "text-green-500"
                                  : isDarkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.title}
                            </span>

                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {isSectionComplete(index)
                                ? "Complete"
                                : "Incomplete"}
                            </span>
                          </div>

                          <div
                            className={`w-full h-1 ${
                              isDarkMode ? "bg-gray-800" : "bg-gray-200"
                            } rounded-full mt-1 overflow-hidden`}
                          >
                            <div
                              className={
                                isSectionComplete(index)
                                  ? "h-full bg-green-500 w-full"
                                  : "h-full bg-orange-500 w-0"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Completion modal */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-900 to-black border-gray-800"
                  : "bg-white border-gray-200"
              } border rounded-2xl p-8 max-w-md w-full shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  Ticket Created Successfully!
                </h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-6`}
                >
                  Your ticket has been submitted for review. You&aposll be
                  notified once it&aposs been approved.
                </p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className={`px-6 py-2 ${
                      isDarkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                    } rounded-lg transition-colors`}
                  >
                    Back to Home
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/tickets")}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    View My Tickets
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Component */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 z-50
              ${
                toast.type === "success" ? "bg-green-500/90" : "bg-red-500/90"
              } text-white`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateTicket;
