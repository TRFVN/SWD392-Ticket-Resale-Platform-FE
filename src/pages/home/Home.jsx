import React from "react";
import HeroSection from "./HeroSection";
import FeaturedEvents from "./FeatureEvent";
import CategoriesSection from "./CategoriesSection";
import VenuesSection from "./VenuesSection";
import FAQSection from "./FAQSection";
import NewsletterSection from "./NewSletterSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <FeaturedEvents />
      <CategoriesSection />
      <VenuesSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
