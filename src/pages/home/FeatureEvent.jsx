import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const EventCard = ({ title, date, location, price, image }) => (
  <div className="relative rounded-xl overflow-hidden group">
    <div className="aspect-[4/3]">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        {price && (
          <div className="mt-4">
            <span className="px-4 py-2 bg-white/10 rounded-full text-white">
              From ${price}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const FeaturedEvents = () => {
  const events = [
    {
      title: "World Cup Finals 2024",
      date: "Dec 15, 2024",
      location: "Qatar",
      image: "/api/placeholder/800/600",
      isFeatured: true,
    },
    {
      title: "EDM Festival 2024",
      date: "Dec 20",
      location: "Miami",
      price: 79,
      image: "/api/placeholder/400/300",
    },
    {
      title: "NBA All-Star Game",
      date: "Jan 15",
      location: "Los Angeles",
      price: 129,
      image: "/api/placeholder/400/300",
    },
    {
      title: "Broadway Shows",
      date: "Dec 25",
      location: "New York",
      price: 89,
      image: "/api/placeholder/400/300",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="w-12 h-1 bg-orange-500"></span>
              <span className="text-orange-500 font-semibold">
                TRENDING NOW
              </span>
            </div>
            <h2 className="text-4xl font-bold">Most Popular Events</h2>
          </div>
          <button className="text-orange-500 hover:text-orange-600 font-semibold">
            View All →
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Event */}
          <EventCard {...events[0]} />

          {/* Other Events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.slice(1).map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
