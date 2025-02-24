import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionTitle } from "../../components/common/Home";

const TestimonialCard = ({ name, role, image, comment }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative"
  >
    <Quote className="absolute top-6 right-6 text-orange-500/20 w-12 h-12" />
    <div className="flex items-center gap-4 mb-4">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 italic">{comment}</p>
  </motion.div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Music Enthusiast",
      image: "/api/placeholder/100/100",
      comment:
        "The best ticketing platform I've ever used! Super easy to navigate and find great events.",
    },
    {
      name: "Mike Thompson",
      role: "Sports Fan",
      image: "/api/placeholder/100/100",
      comment:
        "Seamless booking experience and great customer service. Highly recommended!",
    },
    {
      name: "Emily Chen",
      role: "Theater Lover",
      image: "/api/placeholder/100/100",
      comment:
        "Love the variety of events and the easy ticket transfer feature. My go-to platform!",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionTitle
          title="What Our Customers Say"
          subtitle="Don't just take our word for it"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
