import React, { useEffect, useRef, useState } from "react";
import { Plus, Upload } from "lucide-react";
import { getAllEventApi } from "../../../services/eventApi";
import { getAllCategoryApi } from "../../../services/categoryApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../config/axiosConfig";
import { postTicketApi } from "../../../services/ticket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateTicket() {
  const navigate = useNavigate();
  const [eventList, setEventList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [openEventList, setOpenEventList] = useState(false);
  const [openCategoryList, setOpenCategoryList] = useState(false);
  const [chosenEvent, setChosenEvent] = useState({});
  const [chosenCategory, setChosenCategory] = useState({});
  const [imageUrl, setImageUrl] = useState(
    "https://salt.tkbcdn.com/ts/ds/92/72/1e/f512ada4512f5f41ec44723925e84c38.png",
  );

  const steps = [
    "Ticket Image",
    "Ticket Name",
    "Serial Number",
    "Ticket Description",
    "Category",
    "Event",
    "Ticket Price",
  ];
  const [currentStep, setCurrentStep] = useState(2);
  const eventRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const getEvent = async () => {
      const response = await getAllEventApi();
      if (response) {
        setEventList(response);
      }
    };
    const getCategory = async () => {
      const response = await getAllCategoryApi();
      if (response) {
        setCategoryList(response);
      }
    };
    getEvent();
    getCategory();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        "/Tickets/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setImageUrl(response.data.result);
      formik.setFieldValue("imageUrl", response.data.result);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleEventSelect = (event) => {
    setChosenEvent(event);
    formik.setFieldValue("eventId", event.eventId);
    formik.setFieldValue("eventName", event.eventName);
  };

  const handleCategorySelect = (category) => {
    setChosenCategory(category);
    formik.setFieldValue("categoryId", category.categoryId);
    formik.setFieldValue("categoryName", category.categoryName);
  };

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

  const formik = useFormik({
    initialValues: {
      ticketName: "",
      ticketDescription: "",
      eventId: chosenEvent.eventId || "",
      eventName: chosenEvent.eventName || "",
      categoryId: chosenCategory.categoryId || "",
      categoryName: chosenCategory.categoryName || "",
      imageUrl: imageUrl || "",
      serialNumber: "",
      ticketPrice: "",
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
    }),
    onSubmit: async (values, { resetForm }) => {
      const response = await postTicketApi(values);
      if (response) {
        toast.success(
          "Create ticket successfully. Please wait for staff review",
        );
        resetForm();
        navigate("/");
      } else {
        toast.error("Failed to create ticket. Please try again.");
      }
      console.log("Form submitted with values:", values);
    },
  });

  return (
    <div className="flex flex-col justify-start items-start gap-8 py-8 px-72 w-full min-h-screen overflow-hidden">
      <div className="flex flex-row justify-start items-center gap-3 text-white">
        <div className="bg-orange-500/10 p-3 rounded-lg">
          <Plus className="text-orange-500" />
        </div>
        <span className="text-2xl font-bold text-white">Create New Ticket</span>
      </div>
      <form
        className="flex flex-row justify-between items-start rounded-md w-full bg-gray-800/50 p-10 border-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-14 w-[15%]">
          <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`mb-10 ms-6 ${
                  index === steps.length - 1 ? "mb-0" : ""
                }`}
              >
                <span className="absolute flex items-center justify-center -start-2.5 h-5 w-5 bg-orange-700 rounded-full ring-4 ring-orange-500">
                  <span
                    className={`absolute flex items-center justify-center h-2.5 w-2.5 rounded-full ring-2 ${
                      currentStep >= index
                        ? "bg-orange-700 ring-orange-500 "
                        : "bg-white ring-gray-300 "
                    }`}
                  >
                    {currentStep > index && (
                      <svg
                        className="w-6 h-6 text-gray-800"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m5 12 4.7 4.5 9.3-9"
                        />
                      </svg>
                    )}
                  </span>
                </span>
                <h3 className="font-medium leading-tight">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col justify-start items-start gap-8 w-full">
          <div className="flex flex-col justify-start items-start gap-6 w-full">
            <label
              className="text-xl font-medium text-orange-500"
              htmlFor="imageUrl"
            >
              1. Ticket Image
              {/* (<span className="text-red-500">*</span>) */}
            </label>
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <div className="text-red-500 text-sm">
                {formik.errors.imageUrl}
              </div>
            )}
            <div className="flex flex-col justify-center items-center gap-6 w-5/6 border rounded-lg p-10">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="min-w-full max-w-md rounded-lg"
                />
              ) : (
                <img
                  src="https://ehs.stanford.edu/wp-content/uploads/missing-image.png"
                  alt="upload_image"
                  className="min-w-full max-w-md rounded-lg"
                />
              )}
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-600 hover:text-white transition-colors">
                <Upload className="mr-2" />
                <span className="text-lg">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-5 w-5/6">
            <label
              className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer"
              htmlFor="ticketName"
            >
              2. Ticket Name
            </label>
            <input
              type="text"
              id="ticketName"
              name="ticketName"
              className="border rounded-md px-3 py-2 w-full bg-gray-800/50"
              value={formik.values.ticketName}
              onChange={formik.handleChange}
            />
            {formik.touched.ticketName && formik.errors.ticketName && (
              <div className="text-red-500 text-sm">
                {formik.errors.ticketName}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start items-start gap-5 w-5/6">
            <label
              className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer"
              htmlFor="serialNumber"
            >
              3. Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              className="border rounded-md px-3 py-2 w-full bg-gray-800/50"
              value={formik.values.serialNumber}
              onChange={formik.handleChange}
            />
            {formik.touched.serialNumber && formik.errors.serialNumber && (
              <div className="text-red-500 text-sm">
                {formik.errors.serialNumber}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start items-start gap-5 w-5/6">
            <label
              className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer"
              htmlFor="ticketDescription"
            >
              4. Ticket Description
            </label>
            <textarea
              id="ticketDescription"
              name="ticketDescription"
              className="border rounded-md px-3 py-2 w-full bg-gray-800/50"
              rows={7}
              value={formik.values.ticketDescription}
              onChange={formik.handleChange}
            />
            {formik.touched.ticketDescription &&
              formik.errors.ticketDescription && (
                <div className="text-red-500 text-sm">
                  {formik.errors.ticketDescription}
                </div>
              )}
          </div>

          <div className="flex flex-row justify-start items-start gap-20 w-5/6">
            <div className="flex flex-col justify-start items-start gap-5 w-1/2">
              <label className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer">
                5. Category
              </label>
              <div
                className="cursor-pointer w-full relative"
                onClick={() => setOpenCategoryList((prev) => !prev)}
                ref={categoryRef}
              >
                <div className="border rounded-md py-2 px-4 w-full text-white">
                  {chosenCategory.categoryName ||
                    "-- Please select a category --"}
                </div>
                {openCategoryList && (
                  <div className="z-10 absolute mt-5 bg-white rounded-lg shadow w-full">
                    <ul className="h-auto py-2 overflow-y-auto text-gray-700">
                      {categoryList.map((category, index) => (
                        <li key={index}>
                          <div
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category.categoryName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-start items-start gap-5 w-1/2">
              <label className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer">
                6. Event
              </label>
              <div
                className="cursor-pointer w-full relative"
                onClick={() => setOpenEventList((prev) => !prev)}
                ref={eventRef}
              >
                <div className="border rounded-md py-2 px-4 w-full text-white">
                  {chosenEvent.eventName || "-- Please select an event --"}
                </div>
                {openEventList && (
                  <div className="z-10 absolute mt-5 bg-white rounded-lg shadow w-full">
                    <ul className="h-auto py-2 overflow-y-auto text-gray-700">
                      {eventList.map((event, index) => (
                        <li key={index}>
                          <div
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEventSelect(event)}
                          >
                            {event.eventName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-5 w-5/12 pr-10 relative">
            <label
              className="flex flex-row text-lg font-medium text-orange-500 cursor-pointer"
              htmlFor="ticketPrice"
            >
              7. Ticket Price
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="ticketPrice"
                name="ticketPrice"
                className="border rounded-md px-3 py-2 w-full bg-gray-800/50 pr-8"
                value={
                  formik.values.ticketPrice
                    ? Number(formik.values.ticketPrice).toLocaleString("vi-VN")
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  if (/^\d*$/.test(rawValue)) {
                    formik.setFieldValue("ticketPrice", rawValue);
                  }
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ₫
              </span>
            </div>
            {formik.touched.ticketPrice && formik.errors.ticketPrice && (
              <div className="text-red-500 text-sm">
                {formik.errors.ticketPrice}
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center items-center w-5/6 mt-10">
            <button
              type="submit"
              className="bg-orange-500 text-white font-bold py-2 px-6 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;
