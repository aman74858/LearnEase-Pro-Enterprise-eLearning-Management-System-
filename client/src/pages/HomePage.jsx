import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PartnersSection from '../components/home/PartnersSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedCourses from '../components/home/FeaturedCourses';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import TopInstructors from '../components/home/TopInstructors';
import LiveLearningBanner from '../components/home/LiveLearningBanner';
import Testimonials from '../components/home/Testimonials';
import PricingPlans from '../components/home/PricingPlans';
import FaqSection from '../components/home/FaqSection';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <PartnersSection />
      <CategorySection />
      <FeaturedCourses />
      <WhyChooseUs />
      <HowItWorks />
      <TopInstructors />
      <LiveLearningBanner />
      <Testimonials />
      <PricingPlans />
      <FaqSection />
      <Newsletter />
    </div>
  );
};

export default HomePage;

