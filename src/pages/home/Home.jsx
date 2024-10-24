import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMusic,
  FaTheaterMasks,
  FaFutbol,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaShieldAlt,
  FaHeadset,
  FaTags,
  FaMobileAlt,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { PiMegaphoneBold } from "react-icons/pi";
import { TestimonialCard, EventCard, NewsCard, FAQItem } from "./SubComponent";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Home = () => {
  const [selectedMonth, setSelectedMonth] = useState("Dec");

  return (
    <div className="min-h-screen">
      {/* Hero Section - Improved */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent dark:from-gray-900/90 dark:via-gray-900/70 dark:to-gray-900/50 z-10" />
          <img
            src="https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_464:283,w_3840,g_auto/f_auto/q_auto/habib-ayoade-PZ8lyg_c-pk-us-non-editorial_onv3g6?_a=BAVAEyBy0"
            alt="Event crowd"
            className="w-full h-full object-cover transform scale-105"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center z-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-6">
              The World's #1 Ticketing Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Where Moments <br />
              Become Memories
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8">
              Discover and book tickets for the most exciting events happening
              around you
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-semibold transition-colors duration-300"
              >
                Browse Events
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full text-lg font-semibold transition-colors duration-300"
              >
                Host an Event
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-orange-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1M+", label: "Happy Customers" },
              { number: "50K+", label: "Events Hosted" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "150+", label: "Partner Venues" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
              >
                <h3 className="text-5xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Most Popular Events
              </h2>
            </div>
            <button className="text-orange-500 hover:text-orange-600 font-semibold text-lg">
              View All →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Featured Event */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden group">
              <img
                src="https://cdn.plus.fifa.com/images/public/cms/a7/b4/47/5d/a7b4475d-2acd-4fc1-9eab-28f4c7e4c741.jpg?width=800&height=450"
                alt="Featured event"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm">
                      Featured
                    </span>
                    <span className="text-white/80">Dec 15, 2024</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    World Cup Finals 2024
                  </h3>
                  <p className="text-white/80 mb-6">
                    Experience the ultimate football showdown live at the iconic
                    stadium
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Tickets
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Smaller Trending Events */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: "EDM Festival 2024",
                  image:
                    "https://images.fptplay.net/media/OTT/VOD/2022/10/18/edmfestivallandofdreams_ott_n18-10-2022_17g11-07.jpg",
                  date: "Dec 20",
                  location: "Miami",
                  price: 79,
                },
                {
                  title: "NBA All-Star Game",
                  image:
                    "https://sportshub.cbsistatic.com/i/r/2024/02/20/230f7c46-b01f-4c7e-9f87-ea069b054787/thumbnail/1200x675/eaf2709350705da7679e9a96184e4134/kat-all-star-game-g.jpg",
                  date: "Jan 15",
                  location: "Los Angeles",
                  price: 129,
                },
                {
                  title: "Broadway Shows",
                  image:
                    "https://images.ctfassets.net/1aemqu6a6t65/7itGivzNvJXbB1htnRO86h/058afdf5947c344803214a2f9b0c8146/Aladdin-the-musical-2-Broadway-Manhattan-NYC-Courtesy-Disney.jpg",
                  date: "Dec 25",
                  location: "New York",
                  price: 89,
                },
                {
                  title: "Comedy Night",
                  image:
                    "https://www.wowweekend.vn/document_root/upload/articles/image/BrowseContent/WCoffeeTalk/202108/Saigon%20T%E1%BA%BFu/1.jpg",
                  date: "Dec 18",
                  location: "Chicago",
                  price: 49,
                },
              ].map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Discover by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find the perfect entertainment for every taste
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaMusic className="text-5xl" />,
                name: "Concerts",
                count: "1.2k+ Events",
              },
              {
                icon: <FaTheaterMasks className="text-5xl" />,
                name: "Theater",
                count: "850+ Shows",
              },
              {
                icon: <FaFutbol className="text-5xl" />,
                name: "Sports",
                count: "945+ Matches",
              },
              {
                icon: <PiMegaphoneBold className="text-5xl" />,
                name: "Festivals",
                count: "670+ Events",
              },
              {
                icon: <FaMusic className="text-5xl" />,
                name: "Live Music",
                count: "2.3k+ Shows",
              },
              {
                icon: <FaTheaterMasks className="text-5xl" />,
                name: "Comedy",
                count: "450+ Shows",
              },
              {
                icon: <FaFutbol className="text-5xl" />,
                name: "eSports",
                count: "320+ Events",
              },
              {
                icon: <PiMegaphoneBold className="text-5xl" />,
                name: "Exhibitions",
                count: "580+ Events",
              },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-700 p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="text-orange-500 mb-6 transform group-hover:-translate-y-1 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-300">
                  {category.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events by Month */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <div className="flex gap-4">
              {["Dec", "Jan", "Feb", "Mar"].map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-6 py-2 rounded-full transition-colors
                    ${
                      selectedMonth === month
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white"
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Event cards will be mapped here */}
          </div>
        </div>
      </section>
      {/* Popular Venues */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Venues
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore the most iconic event spaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Madison Square Garden",
                location: "New York, USA",
                capacity: "20,000",
                image:
                  "https://offloadmedia.feverup.com/secretnyc.co/wp-content/uploads/2024/06/21130322/madison-square-gardens_1-1-1024x683.jpg",
              },
              {
                name: "O2 Arena",
                location: "London, UK",
                capacity: "18,000",
                image: "https://populous.com/uploads/2018/01/O2_FirstFrame.jpg",
              },
              {
                name: "Staples Center",
                location: "Los Angeles, USA",
                capacity: "19,000",
                image:
                  "https://e0.365dm.com/21/05/2048x1152/skysports-staples-center-los-angeles-lakers_5397360.jpg?20210528053405",
              },
              {
                name: "Sydney Opera House",
                location: "Sydney, AUS",
                capacity: "5,738",
                image:
                  "https://cdn.britannica.com/85/95085-050-C749819D/Sydney-Opera-House-Bennelong-Point-Port-Jackson.jpg",
              },
              {
                name: "Wembley Stadium",
                location: "London, UK",
                capacity: "90,000",
                image:
                  "https://populous.com/uploads/2018/01/Wembley_5-1200x675-c-center.jpg",
              },
              {
                name: "Tokyo Dome",
                location: "Tokyo, JP",
                capacity: "55,000",
                image:
                  "https://supplier-studio.com//wp-content/uploads/2023/08/image-16-1024x576.png",
              },
            ].map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-80 rounded-2xl overflow-hidden"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {venue.name}
                    </h3>
                    <p className="text-white/80 mb-4">{venue.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">
                        Capacity: {venue.capacity}
                      </span>
                      <button className="text-orange-400 hover:text-orange-300 font-medium">
                        View Events →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Don't just take our word for it
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest News & Updates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Stay informed about the entertainment world
              </p>
            </div>
            <button className="text-orange-500 hover:text-orange-600 font-semibold">
              View All Articles →
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Top Summer Music Festivals 2024",
                date: "Dec 1, 2023",
                excerpt:
                  "Get ready for an incredible lineup of music festivals coming your way...",
                image: "/api/placeholder/400/300",
              },
              {
                title: "New Venue Opening in Downtown",
                date: "Nov 28, 2023",
                excerpt:
                  "A state-of-the-art entertainment venue is opening its doors next month...",
                image: "/api/placeholder/400/300",
              },
              {
                title: "Artist Spotlight: World Tour 2024",
                date: "Nov 25, 2023",
                excerpt:
                  "Leading artists announce their biggest world tours for the upcoming year...",
                image: "/api/placeholder/400/300",
              },
            ].map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Got questions? We've got answers
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I purchase tickets?",
                answer:
                  "Simply browse events, select your desired tickets, and proceed to checkout. We accept all major payment methods.",
              },
              {
                question: "Can I get a refund for my tickets?",
                answer:
                  "Refund policies vary by event. Please check the specific event's terms and conditions for details.",
              },
              {
                question: "How do I transfer tickets to someone else?",
                answer:
                  "You can easily transfer tickets through your account dashboard or the mobile app.",
              },
              {
                question: "Are the tickets guaranteed authentic?",
                answer:
                  "Yes, all tickets purchased through TicketHub are 100% guaranteed authentic.",
              },
            ].map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Improved */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Never Miss an Event
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our newsletter and get personalized event recommendations,
              exclusive presale codes, and special offers
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-900 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                Subscribe
              </motion.button>
            </div>
            <p className="text-sm text-white/80 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms of
              Service
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
export default Home;
