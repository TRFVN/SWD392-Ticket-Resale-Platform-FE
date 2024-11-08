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
      console.log(imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      ticketName: "",
      ticketDescription: "",
      eventId: chosenEvent.eventId,
      eventName: chosenEvent.eventName,
      categoryId: chosenCategory.categoryId,
      categoryName: chosenCategory.categoryName,
      imageUrl: imageUrl,
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
    onSubmit: (values) => {
      // handle form submission
      console.log("Form submitted with values:", values);
    },
  });
  console.log(eventList);
  console.log(categoryList);
  console.log(chosenCategory);
  return (
    <div className="flex flex-col justify-start items-start gap-8 py-8 px-72 w-full min-h-screen overflow-hidden">
      <div className="flex flex-row justify-start items-center gap-3 text-orange-500 ">
        <Plus />
        <span className="text-xl font-semibold ">Create New Ticket</span>
      </div>
      <form
        className="flex flex-col justify-start items-start gap-8 border rounded-md w-full p-8"
        onSubmit={formik.handleSubmit}
      >
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
            value={formik.values.ticketName}
            onChange={formik.handleChange}
          />
          {formik.touched.ticketName && formik.errors.ticketName && (
            <div className="text-red-500 text-sm">
              {formik.errors.ticketName}
            </div>
          )}
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
              value={formik.values.serialNumber}
              onChange={formik.handleChange}
            />
            {formik.touched.serialNumber && formik.errors.serialNumber && (
              <div className="text-red-500 text-sm">
                {formik.errors.serialNumber}
              </div>
            )}
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
              value={formik.values.ticketPrice}
              onChange={formik.handleChange}
            />
            {formik.touched.ticketPrice && formik.errors.ticketPrice && (
              <div className="text-red-500 text-sm">
                {formik.errors.ticketPrice}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full">
          <div className="flex flex-row text-lg font-medium">
            Upload Image (<span className="text-red-500">*</span>)
          </div>
          <div className="flex flex-row justify-center gap-10 items-center w-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-4 w-full max-w-md rounded-md"
              />
            ) : (
              <img
                src="https://ehs.stanford.edu/wp-content/uploads/missing-image.png"
                alt="upload_image"
                className="mt-4 w-full max-w-md rounded-md"
              />
            )}
            <label className="mt-5 cursor-pointer inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-600 hover:text-white transition-colors">
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white py-2 px-4 rounded-md w-full text-center mt-5"
        >
          Create Ticket
        </button>
      </form>
    </div>
  );
}

export default CreateTicket;
// import React, { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import { getAllEventApi } from "../../../services/eventApi";
// import { getAllCategoryApi } from "../../../services/categoryApi";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axiosInstance from "../../../config/axiosConfig";

// function CreateTicket() {
//   const [eventList, setEventList] = useState([]);
//   const [categoryList, setCategoryList] = useState([]);
//   const [openEventList, setOpenEventList] = useState(false);
//   const [openCategoryList, setOpenCategoryList] = useState(false);
//   const [imageUrl, setImageUrl] = useState(null);

//   useEffect(() => {
//     const getEvent = async () => {
//       const response = await getAllEventApi();
//       if (response) {
//         setEventList(response);
//       }
//     };
//     const getCategory = async () => {
//       const response = await getAllCategoryApi();
//       if (response) {
//         setCategoryList(response);
//       }
//     };
//     getEvent();
//     getCategory();
//   }, []);

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axiosInstance.post(
//         "/Tickets/upload-image",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       setImageUrl(response.data.result);
//     } catch (error) {
//       console.error("Image upload failed:", error);
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       ticketName: "",
//       ticketDescription: "",
//       eventId: "",
//       eventName: "",
//       categoryId: "",
//       categoryName: "",
//       imageUrl: "",
//       serialNumber: "",
//       ticketPrice: "",
//     },
//     validationSchema: Yup.object({
//       ticketName: Yup.string()
//         .required("Ticket Name is required")
//         .min(10, "Ticket Name must be at least 10 characters"),
//       ticketDescription: Yup.string()
//         .required("Ticket Description is required")
//         .min(10, "Ticket Description must be at least 10 characters"),
//       serialNumber: Yup.string()
//         .required("Serial Number is required")
//         .min(10, "Serial Number must be at least 10 characters"),
//       ticketPrice: Yup.number()
//         .required("Ticket Price is required")
//         .min(1, "Ticket Price must be greater than 0"),
//       eventId: Yup.string().required("Event selection is required"),
//       categoryId: Yup.string().required("Category selection is required"),
//       imageUrl: Yup.string().required("Image upload is required"),
//     }),
//     onSubmit: (values) => {
//       console.log("Form submitted with values:", values);
//     },
//   });

//   return (
//     <div className="flex flex-col justify-start items-start gap-8 py-8 px-72 w-full min-h-screen overflow-hidden">
//       <div className="flex flex-row justify-start items-center gap-3 text-orange-500 ">
//         <Plus />
//         <span className="text-xl font-semibold ">Create New Ticket</span>
//       </div>
//       <form
//         className="flex flex-col justify-start items-start gap-8 border rounded-md w-full p-8"
//         onSubmit={formik.handleSubmit}
//       >
//         <div className="flex flex-col justify-start items-start gap-3 w-full">
//           <label
//             className="flex flex-row text-lg font-medium"
//             htmlFor="ticketName"
//           >
//             Ticket Name (<span className="text-red-500">*</span>)
//           </label>
//           <input
//             type="text"
//             id="ticketName"
//             name="ticketName"
//             className="border rounded-md px-3 py-2 w-full"
//             value={formik.values.ticketName}
//             onChange={formik.handleChange}
//           />
//           {formik.touched.ticketName && formik.errors.ticketName && (
//             <div className="text-red-500 text-sm">
//               {formik.errors.ticketName}
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col justify-start items-start gap-3 w-full">
//           <label
//             className="flex flex-row text-lg font-medium"
//             htmlFor="ticketDescription"
//           >
//             Ticket Description (<span className="text-red-500">*</span>)
//           </label>
//           <textarea
//             type="text"
//             id="ticketDescription"
//             name="ticketDescription"
//             className="border rounded-md px-3 py-2 w-full"
//             rows={7}
//             value={formik.values.ticketDescription}
//             onChange={formik.handleChange}
//           />
//           {formik.touched.ticketDescription &&
//             formik.errors.ticketDescription && (
//               <div className="text-red-500 text-sm">
//                 {formik.errors.ticketDescription}
//               </div>
//             )}
//         </div>

//         <div className="flex flex-row justify-start items-start gap-5 w-full">
//           <div className="flex flex-col justify-start items-start gap-3 w-1/2">
//             <div className="flex flex-row justify-start items-center gap-7 w-full">
//               <div className="inline-flex text-lg font-medium">
//                 Category <span className="text-red-500">*</span>
//               </div>
//               <div
//                 className="cursor-pointer w-full"
//                 onClick={() => setOpenCategoryList((prev) => !prev)}
//               >
//                 <div className="border rounded-md py-2 px-4 w-full text-gray-700">
//                   {formik.values.categoryName ||
//                     "-- Please select a category --"}
//                 </div>
//                 <div className="relative">
//                   {openCategoryList && (
//                     <div className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full">
//                       <ul className="h-auto py-2 overflow-y-auto text-gray-700">
//                         {categoryList.map((category, index) => (
//                           <li key={index}>
//                             <div
//                               className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => {
//                                 formik.setFieldValue(
//                                   "categoryId",
//                                   category.categoryId,
//                                 );
//                                 formik.setFieldValue(
//                                   "categoryName",
//                                   category.categoryName,
//                                 );
//                                 setOpenCategoryList(false);
//                               }}
//                             >
//                               {category.categoryName}
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col justify-start items-start gap-3 w-1/2">
//             <div className="flex flex-row justify-start items-center gap-7 w-full">
//               <div className="inline-flex text-lg font-medium">
//                 Event <span className="text-red-500">*</span>
//               </div>
//               <div
//                 className="cursor-pointer w-full"
//                 onClick={() => setOpenEventList((prev) => !prev)}
//               >
//                 <div className="border rounded-md py-2 px-4 w-full text-gray-700">
//                   {formik.values.eventName || "-- Please select an event --"}
//                 </div>
//                 <div className="relative">
//                   {openEventList && (
//                     <div className="z-10 absolute mt-2 bg-white rounded-lg shadow w-full">
//                       <ul className="h-auto py-2 overflow-y-auto text-gray-700">
//                         {eventList.map((event, index) => (
//                           <li key={index}>
//                             <div
//                               className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                               onClick={() => {
//                                 formik.setFieldValue("eventId", event.eventId);
//                                 formik.setFieldValue(
//                                   "eventName",
//                                   event.eventName,
//                                 );
//                                 setOpenEventList(false);
//                               }}
//                             >
//                               {event.eventName}
//                             </div>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-row justify-start items-start gap-5 w-full">
//           <div className="flex flex-col justify-start items-start gap-3 w-full">
//             <label
//               className="flex flex-row text-lg font-medium"
//               htmlFor="serialNumber"
//             >
//               Serial Number (<span className="text-red-500">*</span>)
//             </label>
//             <input
//               type="text"
//               id="serialNumber"
//               name="serialNumber"
//               className="border rounded-md px-3 py-2 w-full"
//               value={formik.values.serialNumber}
//               onChange={formik.handleChange}
//             />
//             {formik.touched.serialNumber && formik.errors.serialNumber && (
//               <div className="text-red-500 text-sm">
//                 {formik.errors.serialNumber}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col justify-start items-start gap-3 w-full">
//             <label
//               className="flex flex-row text-lg font-medium"
//               htmlFor="ticketPrice"
//             >
//               Ticket Price (<span className="text-red-500">*</span>)
//             </label>
//             <input
//               type="number"
//               id="ticketPrice"
//               name="ticketPrice"
//               min={0}
//               className="border rounded-md px-3 py-2 w-full"
//               value={formik.values.ticketPrice}
//               onChange={formik.handleChange}
//             />
//             {formik.touched.ticketPrice && formik.errors.ticketPrice && (
//               <div className="text-red-500 text-sm">
//                 {formik.errors.ticketPrice}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col justify-start items-start gap-3 w-full">
//           <label
//             className="flex flex-row text-lg font-medium"
//             htmlFor="imageUrl"
//           >
//             Image (<span className="text-red-500">*</span>)
//           </label>
//           <input
//             type="file"
//             id="imageUrl"
//             name="imageUrl"
//             onChange={(event) => handleImageUpload(event, formik.setFieldValue)}
//           />
//           {formik.touched.imageUrl && formik.errors.imageUrl && (
//             <div className="text-red-500 text-sm">{formik.errors.imageUrl}</div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md"
//         >
//           Create Ticket
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateTicket;
