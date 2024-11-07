import React, { useEffect, useState } from "react";
import { Pencil, Trash, OctagonAlert } from "lucide-react";
import { deleteEventApi, getAllEventApi } from "../../../services/eventApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteEvent from "./DeleteEvent";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
function GetAll() {
  const [eventList, setEventList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const getEvents = async () => {
    const response = await getAllEventApi();
    if (response) {
      setIsLoading(false);
      setEventList(response);
    }
  };
  useEffect(() => {
    getEvents();
  }, []);

  const handleOpenDeleteModal = (event) => {
    setCurrentEvent(event);
    setShowDeleteModal(true);
  };
  const hanldeCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const hanldeConfirmDeleteModal = () => {
    const deleteEvent = async () => {
      const response = await deleteEventApi(currentEvent.eventId);
      if (response) {
        toast.success("Delete event successfully");
        getEvents();
      } else {
        toast.error("Failed to delete event. Please try again");
      }
    };
    deleteEvent();
    setShowDeleteModal(false);
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
    <>
      {isLoading ? (
        <div className="flex flex-row justify-center items-start w-full">
          <Loader />
        </div>
      ) : (
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
                    {event.status === 1 ? (
                      <>
                        <span className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-green-500 p-2 text-green-500 text-xs hover:bg-green-500 hover:text-white">
                          <Pencil />
                        </span>
                        <span
                          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-red-500 p-2 text-red-500 text-xs hover:bg-red-500 hover:text-white"
                          onClick={() => handleOpenDeleteModal(event)}
                        >
                          <Trash />
                        </span>
                      </>
                    ) : (
                      <div>
                        <OctagonAlert
                          className="text-yellow-500 cursor-pointer "
                          onClick={() =>
                            toast.warning("This event was deleted")
                          }
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showDeleteModal && (
            <DeleteEvent
              currentEvent={currentEvent}
              showDeleteModal={showDeleteModal}
              hanldeCloseDeleteModal={hanldeCloseDeleteModal}
              hanldeConfirmDeleteModal={hanldeConfirmDeleteModal}
            />
          )}
        </div>
      )}
    </>
  );
}

export default GetAll;
