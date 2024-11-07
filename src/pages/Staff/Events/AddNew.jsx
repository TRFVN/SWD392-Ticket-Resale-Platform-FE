import React, { useEffect, useState } from "react";
import { Asterisk } from "lucide-react";
import { getLocationApi } from "../../../services/eventApi";
import { useFormik } from "formik";
import * as Yup from "yup";
function AddNew() {
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
  };
  console.log(cityList);

  const formik = useFormik({
    initialValues: {
      eventName: "",
      eventDate: "",

      city: "",
      district: "",
      address: "",
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
      city: Yup.string().required("City is required"),
      district: Yup.string().required("District is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });
  return (
    <form className="flex flex-col justify-start items-start gap-5 p-8 w-full">
      <div className="flex flex-row justify-start items-start gap-2 w-full">
        <div className="flex flex-col gap-3 w-1/2">
          <label
            htmlFor="eventName"
            className="flex flex-row text-lg font-medium"
          >
            Event Name (
            <span className="flex flex-row justify-center items-center text-center text-sm text-red-500">
              *
            </span>
            )
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            placeholder=""
            rows={3}
            className="border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-3 w-1/2">
          <label
            htmlFor="eventDate"
            className="flex flex-row text-lg font-medium"
          >
            Event Date (
            <span className="flex flex-row justify-center items-center text-center text-sm text-red-500">
              *
            </span>
            )
          </label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            placeholder=""
            rows={3}
            className="border rounded-md px-3 py-2"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <label
          htmlFor="eventLocation"
          className="flex flex-row text-lg font-medium"
        >
          Location (
          <span className="flex flex-row justify-center items-center text-center text-sm text-red-500">
            *
          </span>
          )
        </label>
        <div className="grid grid-cols-3 flex-row justify-start items-start w-full">
          <div className="col-span-1 flex flex-row justify-start items-center gap-7 w-full pr-5">
            <span className="font-medium">Country:</span>
            <div className="border rounded-md py-2 px-4 w-full text-gray-700">
              Viet Nam
            </div>
          </div>
          <div className="col-span-1 flex flex-row justify-start items-center gap-7 w-full pr-5">
            <span className="font-medium">City:</span>
            <div
              className="cursor-pointer w-full"
              onClick={() => setOpenCity((prev) => !prev)}
            >
              <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                {chosenCity.name || "-- Please select a city --"}
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
          <div className="col-span-1 flex flex-row justify-start items-center gap-7 w-full pr-5">
            <span className="font-medium">District:</span>
            <div
              className="cursor-pointer w-full"
              onClick={() => setOpenDistrict((prev) => !prev)}
            >
              <div className="border rounded-md py-2 px-4 w-full text-gray-700">
                {chosenDistrict.name || "-- Please select a district --"}
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
                            onClick={() => setChosenDistrict(district)}
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
        </div>
      </div>
    </form>
  );
}

export default AddNew;
