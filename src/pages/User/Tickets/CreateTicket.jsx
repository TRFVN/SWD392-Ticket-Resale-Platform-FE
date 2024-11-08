import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getAllEventApi } from "../../../services/eventApi";
import { getAllCategoryApi } from "../../../services/categoryApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../../config/axiosConfig";
function CreateTicket() {
  const [eventList, setEventList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [openEventList, setOpenEventList] = useState(false);
  const [openCategoryList, setOpenCategoryList] = useState(false);
  const [chosenEvent, setChosenEvent] = useState({});
  const [chosenCategory, setChosenCategory] = useState({});
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
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the API response has the image URL at `response.data.url`
      setImageUrl(response.data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  console.log(eventList);
  console.log(categoryList);
  return (
    <div className="flex flex-col justify-start items-start gap-8 py-8 px-72 w-full min-h-screen overflow-hidden">
      <div className="flex flex-row justify-start items-center gap-3 text-orange-500 ">
        <Plus />
        <span className="text-xl font-semibold ">Create New Ticket</span>
      </div>
      <form className="flex flex-col justify-start items-start gap-8 border rounded-md w-full p-8">
        <div className="flex flex-col justify-start items-start gap-3 w-full">
          <label
            className="flex flex-row text-lg font-medium"
            htmlFor="ticketName"
          >
            Ticket Name (<span className="text-red-500">*</span>)
          </label>
          <input
            type="text"
            id="ticketName"
            name="ticketName"
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col justify-start items-start gap-3 w-full">
          <label
            className="flex flex-row text-lg font-medium"
            htmlFor="ticketDescription"
          >
            Ticket Description (<span className="text-red-500">*</span>)
          </label>
          <textarea
            type="text"
            id="ticketDescription"
            name="ticketDescription"
            className="border rounded-md px-3 py-2 w-full"
            rows={7}
          />
        </div>
        <div className="flex flex-row justify-start items-start gap-5 w-full">
          <div className="flex flex-col justify-start items-start gap-3 w-1/2">
            <div className="flex flex-row justify-start items-center gap-7 w-full">
              <div className="inline-flex text-lg font-medium">
                Category <span className="text-red-500">*</span>
              </div>
              <div
                className="cursor-pointer w-full"
                onClick={() => setOpenCategoryList((prev) => !prev)}
              >
                <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                  {chosenCategory.categoryName ||
                    "-- Please select a category --"}
                </div>
                <div className="relative">
                  {openCategoryList && (
                    <div
                      id="dropdownUsers"
                      className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full"
                    >
                      <ul
                        className="h-auto py-2 overflow-y-auto text-gray-700"
                        aria-labelledby="dropdownUsersButton"
                      >
                        {categoryList.map((category, index) => (
                          <li key={index}>
                            <div
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setChosenCategory(category)}
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
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-3 w-1/2">
            <div className="flex flex-row justify-start items-center gap-7 w-full">
              <div className="inline-flex text-lg font-medium">
                Event <span className="text-red-500">*</span>
              </div>
              <div
                className="cursor-pointer w-full"
                onClick={() => setOpenEventList((prev) => !prev)}
              >
                <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                  {chosenEvent.eventName || "-- Please select a event --"}
                </div>
                <div className="relative">
                  {openEventList && (
                    <div
                      id="dropdownUsers"
                      className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full"
                    >
                      <ul
                        className="h-auto py-2 overflow-y-auto text-gray-700"
                        aria-labelledby="dropdownUsersButton"
                      >
                        {eventList.map((event, index) => (
                          <li key={index}>
                            <div
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => setChosenEvent(event)}
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
          </div>
        </div>
        <div className="flex flex-row justify-start items-start gap-5 w-full">
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <label
              className="flex flex-row text-lg font-medium"
              htmlFor="serialNumber"
            >
              Serial Number (<span className="text-red-500">*</span>)
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <label
              className="flex flex-row text-lg font-medium"
              htmlFor="ticketPrice"
            >
              Ticket Price (<span className="text-red-500">*</span>)
            </label>
            <input
              type="number"
              id="ticketPrice"
              name="ticketPrice"
              min={0}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full">
          <div className="flex flex-row text-lg font-medium">
            Upload Image (<span className="text-red-500">*</span>)
          </div>
          <div className="flex flex-col justify-start items-center w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-4 w-full max-w-xs rounded-lg"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;
