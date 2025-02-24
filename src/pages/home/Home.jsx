import React from "react";
import HeroSection from "./HeroSection";
import FeaturedEvents from "./FeatureEvent";
import CategoriesSection from "./CategoriesSection";
import VenuesSection from "./VenuesSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsSection from "./NewsSection";
import FAQSection from "./FAQSection";
import NewsletterSection from "./NewSletterSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <FeaturedEvents />
      <CategoriesSection />
      <VenuesSection />
      <TestimonialsSection />
      <NewsSection />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;
