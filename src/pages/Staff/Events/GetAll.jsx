import React, { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { getAllEventApi } from "../../../services/eventApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteEvent from "./DeleteEvent";
function GetAll() {
  const [eventList, setEventList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const getEvents = async () => {
      const response = await getAllEventApi();
      if (response) {
        setEventList(response);
      }
    };
    getEvents();
  }, []);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const hanldeCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hanldeConfirmDeleteModal = () => {
    setShowDeleteModal(false);
    // Implement delete event logic here
  };
  // console.log(eventList);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg w-full">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Event name
            </th>
            <th scope="col" className="px-6 py-3">
              Event Date
            </th>
            <th scope="col" className="px-6 py-3">
              City
            </th>
            <th scope="col" className="px-6 py-3">
              District
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {eventList.map((event, index) => (
            <tr key={index} className={`border-t`}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {event.eventName}
              </th>
              <td className="px-6 py-4">{formatDate(event.eventDate)}</td>
              <td className="px-6 py-4">{event.city}</td>
              <td className="px-6 py-4">{event.district}</td>
              <td className="px-6 py-4">{event.address}</td>
              <td className="px-6 py-4 flex flex-row justify-start items-center gap-2">
                <span className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-green-500 p-2 text-green-500 text-xs hover:bg-green-500 hover:text-white">
                  <Pencil />
                </span>
                <span
                  className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-red-500 p-2 text-red-500 text-xs hover:bg-red-500 hover:text-white"
                  onClick={() => handleOpenDeleteModal()}
                >
                  <Trash />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteModal && (
        <DeleteEvent
          showDeleteModal={showDeleteModal}
          hanldeCloseDeleteModal={hanldeCloseDeleteModal}
          hanldeConfirmDeleteModal={hanldeConfirmDeleteModal}
        />
      )}
    </div>
  );
}

export default GetAll;
