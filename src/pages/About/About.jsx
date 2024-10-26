import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaHandshake,
  FaGlobeAsia,
  FaLock,
  FaPlay,
  FaChartLine,
  FaTicketAlt,
  FaUserShield,
  FaCreditCard,
  FaRegLightbulb,
  FaMobile,
  FaUsers,
} from "react-icons/fa";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("market");

  const marketStats = [
    {
      number: "3.6T+",
      label: "Market Size by 2031",
      description: "13.48% CAGR Growth",
    },
    {
      number: "36%",
      label: "Music Events",
      description: "Largest segment share",
    },
    {
      number: "6.7%",
      label: "Annual Growth",
      description: "In music events",
    },
    {
      number: "55B+",
      label: "Current Market",
      description: "As of 2022",
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Secure Trading",
      description: "Advanced verification and fraud prevention system",
    },
    {
      icon: <FaHandshake className="w-6 h-6" />,
      title: "Fair Pricing",
      description: "Maximum 20% markup policy ensures reasonable prices",
    },
    {
      icon: <FaCreditCard className="w-6 h-6" />,
      title: "Local Payments",
      description: "Support for MoMo, ZaloPay, and domestic cards",
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: "User Protection",
      description: "Comprehensive transaction security measures",
    },
  ];

  const insights = [
    {
      icon: <FaRegLightbulb className="w-6 h-6" />,
      title: "Market Growth",
      description: "Event industry projected to reach $3.6T by 2031",
    },
    {
      icon: <FaMobile className="w-6 h-6" />,
      title: "Digital Adoption",
      description: "Rising popularity of mobile ticket booking",
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Target Audience",
      description: "Focus on 18-22 age group in major cities",
    },
  ];

  const team = [
    {
      name: "Truong Vo",
      role: "Founder & CEO",
      quote: "Revolutionizing ticket trading in Vietnam",
      image:
        "https://cafeland.vn/image-data/320-320/static1.cafeland.vn/cafelandnew/hinh-anh/2020/05/14/bill-gates-cafeland.jpg",
    },
    {
      name: "Khoa Ho",
      role: "Founder & CTO",
      quote: "Building trust through technology",
      image:
        "https://www.thestreet.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cq_auto:good%2Cw_1200/MTY4NjUwMTkwMDk3NzUzNzM1/zuckerberg-facebook-directors-settle-delaware-suit-over-voting-rights.png",
    },
    {
      name: "Quan Pham",
      role: "Founder & CFO",
      quote: "Ensuring fair and transparent pricing",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY-_R6V-nDMdEKuLC_LNEZG_BJ-6-m74_e1w&s",
    },
    {
      name: "Tuan Phan",
      role: "Founder & COO",
      quote: "Optimizing user experience",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcFhKPBv-7Rl3YA31mX4L1B1ghWvVJbZKnw2NNUwJfwdfp-xckfW0dA7kAvtSOT8eie8A&usqp=CAU",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Hero Section with Background Animation */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent dark:from-orange-600/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            The Future of
            <div className="text-orange-600 dark:text-orange-500">
              Ticket Trading
            </div>
          </motion.h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-12">
            Vietnam's premier platform for secure and fair ticket trading,
            powered by advanced verification technology and local market
            expertise.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 dark:bg-orange-500 text-white px-8 py-4 rounded-xl 
              font-semibold hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
          >
            Discover More
          </motion.button>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaPlay className="rotate-90 text-orange-500 text-2xl" />
        </motion.div>
      </section>

      {/* Interactive Market Insights Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-20">
                <h2 className="text-4xl font-bold mb-6">Market Insights</h2>
                <div className="flex space-x-4 mb-8">
                  {["market", "growth", "future"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-xl transition-colors ${
                        activeTab === tab
                          ? "bg-orange-600 dark:bg-orange-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
                >
                  {activeTab === "market" &&
                    "The event industry market is projected to surpass USD 1313.49 Billion in 2024, with a strong trajectory toward USD 3612.27 Billion by 2031. Music events lead the sector with a 36% market share."}
                  {activeTab === "growth" &&
                    "The market is experiencing remarkable growth at a CAGR of 13.48% from 2024 to 2031, driven by increased adoption of digital platforms and rising demand for live experiences."}
                  {activeTab === "future" &&
                    "Technological advancements and increasing demand for secure digital transactions are shaping the future of ticket trading, with a focus on user protection and authentic experiences."}
                </motion.div>
              </div>
            </motion.div>

            <div className="md:w-1/2">
              <div className="grid grid-cols-1 gap-8">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <div className="text-orange-600 dark:text-orange-500 mb-4">
                      {insight.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {insight.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid with Modern Design */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-600/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-3">
                    {stat.number}
                  </div>
                  <div className="text-xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why TicketHub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-orange-600 dark:text-orange-500 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Modern Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative mb-6 transform-gpu">
                  <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white text-sm">"{member.quote}"</p>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center">
                  {member.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-500 text-center">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Mission & Vision Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-600/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-orange-600 dark:text-orange-500 font-semibold mb-2">
                  Our Mission
                </h3>
                <h2 className="text-3xl font-bold mb-4">
                  Revolutionizing Ticket Trading
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  TicketHub is committed to creating a safe, user-friendly, and
                  fair marketplace for buying and selling tickets. We protect
                  purchasers from inflated costs through our maximum markup
                  policy while ensuring authentic tickets through advanced
                  verification systems.
                </p>
              </div>
              <div>
                <h3 className="text-orange-600 dark:text-orange-500 font-semibold mb-2">
                  Our Vision
                </h3>
                <h2 className="text-3xl font-bold mb-4">
                  The Future of Events
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We envision a future where every ticket transaction is secure,
                  transparent, and fair. By leveraging technology and local
                  market expertise, we're building Vietnam's most trusted
                  platform for event enthusiasts.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {[
                {
                  number: "20%",
                  title: "Maximum Markup",
                  description: "Fair pricing guarantee on all tickets",
                },
                {
                  number: "100%",
                  title: "Secure",
                  description: "Transaction protection and verification",
                },
                {
                  number: "24/7",
                  title: "Support",
                  description: "Round-the-clock customer assistance",
                },
                {
                  number: "Local",
                  title: "Focus",
                  description: "Vietnamese market optimization",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-2">
                    {item.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology & Security Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Technology</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powered by cutting-edge security and verification systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                title: "Blockchain Verification",
                features: [
                  "Ticket authenticity",
                  "Ownership tracking",
                  "Tamper-proof records",
                ],
              },
              {
                icon: <FaLock className="w-8 h-8" />,
                title: "Secure Transactions",
                features: [
                  "End-to-end encryption",
                  "Fraud prevention",
                  "Safe payments",
                ],
              },
              {
                icon: <FaMobile className="w-8 h-8" />,
                title: "Mobile First",
                features: [
                  "Quick access",
                  "Real-time updates",
                  "Easy transfers",
                ],
              },
            ].map((tech, index) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-600/5 rounded-xl transform group-hover:scale-105 transition-transform duration-300" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                  <div className="text-orange-600 dark:text-orange-500 mb-6">
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{tech.title}</h3>
                  <ul className="space-y-2">
                    {tech.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-gray-600 dark:text-gray-400 flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of users who trust TicketHub for secure and fair
            ticket trading
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold 
                hover:bg-gray-100 transition-colors"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl 
                font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
