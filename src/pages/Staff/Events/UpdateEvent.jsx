import React, { useEffect, useState } from "react";
import { Asterisk } from "lucide-react";
import {
  getLocationApi,
  postEventApi,
  putEventApi,
} from "../../../services/eventApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
function UpdateEvent({ handleChangeProgress, curEvent }) {
  console.log(curEvent);
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [openCity, setOpenCity] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [chosenCity, setChosenCity] = useState({});
  const [chosenDistrict, setChosenDistrict] = useState({});
  useEffect(() => {
    const getLocation = async () => {
      const response = await getLocationApi();
      setCityList(response);
    };
    getLocation();
  }, []);

  const updateDistrictList = (city) => {
    setChosenCity(city);
    setDistrictList(city.districts);
    formik.setFieldValue("city", city.name);
    formik.setFieldValue("district", "");
    setChosenDistrict({});
  };
  const getDateMonthYear = (date) => {
    const d = new Date(date);
    const ngay = String(d.getDate()).padStart(2, "0"); // Đảm bảo có hai chữ số
    const thang = String(d.getMonth() + 1).padStart(2, "0"); // Đảm bảo có hai chữ số
    const nam = d.getFullYear();
    return `${nam}-${thang}-${ngay}`;
  };
  const formik = useFormik({
    initialValues: {
      eventName: curEvent.eventName,
      eventDate: getDateMonthYear(curEvent.eventDate),
      eventDescription: curEvent.eventDescription,
      city: curEvent.city,
      district: curEvent.district,
      address: curEvent.address,
    },
    validationSchema: Yup.object({
      eventName: Yup.string()
        .min(10, "Event name must be at least 10 characters")
        .matches(
          /^[a-zA-Z0-9\s]+$/,
          "Event name cannot contain special characters",
        )
        .required("Event name is required"),
      eventDate: Yup.date()
        .min(new Date(), "Event date must be in the future")
        .required("Event date is required"),
      eventDescription: Yup.string()
        .min(20, "Event description must be at least 20 characters")
        .required("Event description is required"),
      city: Yup.string().required("City is required"),
      district: Yup.string().required("District is required"),
      address: Yup.string()
        .min(10, "Address must be at least 10 characters")
        .matches(
          /^[a-zA-Z0-9\s/,]+$/,
          "Address can only contain letters, numbers, spaces, '/' and ','",
        )
        .required("Address is required"),
    }),
    onSubmit: async (values) => {
      const response = await putEventApi({
        eventId: curEvent.eventId,
        eventName: values.eventName,
        eventDescription: values.eventDescription,
        eventDate: values.eventDate,
        city: values.city,
        district: values.district,
        address: values.address,
      });
      if (response) {
        toast.success("Add new event successfully!");
        handleChangeProgress("Get All");
      } else {
        toast.error("Failed to add new event. Please try again.");
      }
      // console.log("Form values:", values);
    },
  });
  return (
    <form
      className="flex flex-col justify-start items-start gap-5 p-8 w-full"
      onSubmit={formik.handleSubmit}
    >
      <div className="flex flex-row justify-start items-start gap-2 w-full">
        <div className="flex flex-col gap-3 w-1/2">
          <label
            htmlFor="eventName"
            className="flex flex-row text-lg font-medium"
          >
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formik.values.eventName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded-md px-3 py-2"
          />
          {formik.touched.eventName && formik.errors.eventName ? (
            <div className="text-red-500">{formik.errors.eventName}</div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 w-1/2">
          <label
            htmlFor="eventDate"
            className="flex flex-row text-lg font-medium"
          >
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formik.values.eventDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded-md px-3 py-2"
          />
          {formik.touched.eventDate && formik.errors.eventDate ? (
            <div className="text-red-500">{formik.errors.eventDate}</div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <label
          htmlFor="eventDescription"
          className="flex flex-row text-lg font-medium"
        >
          Event Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="eventDescription"
          name="eventDescription"
          value={formik.values.eventDescription}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={5}
          className="border rounded-md px-3 py-2"
        />
        {formik.touched.eventDescription && formik.errors.eventDescription ? (
          <div className="text-red-500">{formik.errors.eventDescription}</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <label
          htmlFor="eventLocation"
          className="flex flex-row text-lg font-medium"
        >
          4. Location (
          <span className="flex flex-row justify-center items-center text-center text-sm text-red-500">
            *
          </span>
          )
        </label>
        <div className="grid grid-cols-3 flex-row justify-start items-start w-full">
          <div className="col-span-1 flex flex-row justify-start items-center gap-7 w-full pr-5">
            <span className="font-medium">Country:</span>
            <div className="flex flex-row gap-3 border rounded-md py-2 px-4 w-full text-gray-700">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfq1kNo3HTwBVKm3bjwaW6W_TJz-s2vs4fDA&s"
                alt="Viet_Nam_flag"
                className="h-5 w-5 shadow-md"
              />
              Viet Nam
            </div>
          </div>
          <div className="col-span-1 flex flex-col justify-start items-start gap-3 w-full pr-5">
            <div className="flex flex-row justify-start items-center gap-7 w-full">
              <span className="font-medium">City:</span>
              <div
                className="cursor-pointer w-full"
                onClick={() => setOpenCity((prev) => !prev)}
              >
                <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                  {formik.values.city || "-- Please select a city --"}
                </div>
                <div className="relative">
                  {openCity && (
                    <div
                      id="dropdownUsers"
                      className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full"
                    >
                      <ul
                        className="h-48 py-2 overflow-y-auto text-gray-700"
                        aria-labelledby="dropdownUsersButton"
                      >
                        {cityList.map((city, index) => (
                          <li key={index}>
                            <div
                              href="#"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => updateDistrictList(city)}
                            >
                              {city.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {formik.touched.city && formik.errors.city ? (
              <div className="text-red-500">{formik.errors.city}</div>
            ) : null}
          </div>
          <div className="col-span-1 flex flex-col justify-start items-start gap-3 w-full pr-5">
            <div className="flex flex-row justify-start items-center gap-7 w-full">
              <span className="font-medium">District:</span>
              <div
                className="cursor-pointer w-full"
                onClick={() => setOpenDistrict((prev) => !prev)}
              >
                <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                  {formik.values.district || "-- Please select a district --"}
                </div>
                <div className="relative">
                  {openDistrict && (
                    <div
                      id="dropdownUsers"
                      className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full"
                    >
                      <ul
                        className={`${
                          chosenCity.name ? "h-48" : ""
                        } py-2 overflow-y-auto text-gray-700`}
                        aria-labelledby="dropdownUsersButton"
                      >
                        {districtList.map((district, index) => (
                          <li key={index}>
                            <div
                              href="#"
                              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setChosenDistrict(district);
                                formik.setFieldValue("district", district.name);
                              }}
                            >
                              {district.name}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {formik.touched.district && formik.errors.district ? (
              <div className="text-red-500">{formik.errors.district}</div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-row justify-start items-center gap-5 w-1/2">
          <label htmlFor="address" className="flex flex-row font-medium">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>
        {formik.touched.address && formik.errors.address ? (
          <div className="text-red-500">{formik.errors.address}</div>
        ) : null}
      </div>
      <div className="flex flex-row justify-center items-center w-full my-3">
        <button
          type="submit"
          className="border rounded-md py-2 px-3 cursor-pointer border-orange-400 text-orange-400 hover:bg-orange-500 hover:font-medium hover:text-white"
        >
          Update
        </button>
      </div>
    </form>
  );
}

export default UpdateEvent;
