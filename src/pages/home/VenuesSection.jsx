import React from "react";
import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import { SectionTitle } from "../../components/common/Home";

const VenueCard = ({ name, location, capacity, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group relative rounded-xl overflow-hidden"
  >
    <div className="aspect-[4/3]">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span>Capacity: {capacity}</span>
          </div>
        </div>
        <button className="mt-4 text-orange-400 hover:text-orange-300 font-medium">
          View Events →
        </button>
      </div>
    </div>
  </motion.div>
);

const VenuesSection = () => {
  const venues = [
    {
      name: "Madison Square Garden",
      location: "New York, USA",
      capacity: "20,000",
      image: "/api/placeholder/600/400",
    },
    {
      name: "O2 Arena",
      location: "London, UK",
      capacity: "18,000",
      image: "/api/placeholder/600/400",
    },
    {
      name: "Staples Center",
      location: "Los Angeles, USA",
      capacity: "19,000",
      image: "/api/placeholder/600/400",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <SectionTitle
          title="Popular Venues"
          subtitle="Explore the most iconic event spaces"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <VenueCard key={venue.name} {...venue} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenuesSection;
