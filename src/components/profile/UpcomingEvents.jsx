// Component: UpcomingEvent.jsx
const UpcomingEvent = ({ event }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="relative h-40">
        <img
          src={event.image}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-sm font-medium">{event.date}</p>
          <h3 className="text-lg font-bold">{event.title}</h3>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {event.location}
          </p>
        </div>
        <button className="text-primary-DEFAULT hover:text-primary-dark font-medium text-sm">
          View Tickets
        </button>
      </div>
    </div>
  );
};
export default UpcomingEvent;
